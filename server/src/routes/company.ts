import { Router, Request, Response } from 'express'
import { ComapnyModel } from '../models/Company'
import { UserModel } from '../models/User'
import bcrypt from 'bcrypt'
const router = Router()

const ALLOWED_TYPES = ['AIR', 'SEA', 'ROAD', 'RAILWAY'] as const;

router.get('/get-companies', async (req: Request, res: Response) => {
  try {
    const companies = await ComapnyModel.find().select('-password')
    if (!companies) res.status(400).json({ message: 'Companies does not exsist' })

    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching companies', error })
  }
})
router.get('/get-company', async (req: Request, res: Response) => {
  try {
    const companyId = String(req.query.companyId || '')
    if (!companyId) return res.status(400).json({ message: 'company id does not exsist' })

    const company = await ComapnyModel.findById(companyId)
    if (!company) return res.status(400).json({ message: 'company does not exsist' })

    res.status(200).json(company)
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching company', error })
  }
})
router.patch('/update-pricing', async (req, res) => {
  try {
    const { companyId, pricing } = req.body || {}
    if (!companyId || !pricing) {
      return res.status(400).json({ message: 'companyId and pricing are required' })
    }

    const updated = await ComapnyModel.findByIdAndUpdate(
      companyId,
      { $set: { pricing } },
      { new: true, runValidators: true },
    ).lean()

    if (!updated) {
      return res.status(404).json({ message: 'Company not found' })
    }

    return res.status(200).json({
      message: 'Pricing updated successfully',
      company: updated,
    })
  } catch (error) {
    console.error('Update pricing error:', error)
    return res.status(500).json({ message: 'Error while updating pricing' })
  }
})

router.patch('/update-data', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      companyId,
      name,
      contactEmail,
      phone,
      logoUrl,
      supportedTypes, 
      currentPassword,
      newPassword,
    } =
      (req.body as {
        userId?: string;
        companyId?: string;
        name?: string;
        contactEmail?: string;
        phone?: string;
        logoUrl?: string;
        supportedTypes?: string[];
        currentPassword?: string;
        newPassword?: string;
      }) || {};

    if (!userId || !companyId) {
      return res.status(400).json({ message: 'companyId and userId are required' });
    }

    const $setCompany: Record<string, unknown> = {};
    if (typeof name === 'string') $setCompany.name = name;
    if (typeof phone === 'string') $setCompany.phone = phone;
    if (typeof logoUrl === 'string') $setCompany.logoUrl = logoUrl;

    
    if (Array.isArray(supportedTypes)) {
      const cleaned = [...new Set(supportedTypes.map(String))];
      const bad = cleaned.filter((t) => !ALLOWED_TYPES.includes(t as any));
      if (bad.length) {
        return res.status(400).json({ message: `Invalid supportedTypes: ${bad.join(', ')}` });
      }
      if (cleaned.length === 0) {
        return res.status(400).json({ message: 'supportedTypes must have at least one item' });
      }
      $setCompany.supportedTypes = cleaned;
    }

    let normalizedEmail: string | undefined;
    if (typeof contactEmail === 'string' && contactEmail.trim()) {
      normalizedEmail = contactEmail.trim().toLowerCase();

      const taken = await UserModel.exists({
        _id: { $ne: userId },
        email: normalizedEmail,
      });
      if (taken) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      $setCompany.contactEmail = normalizedEmail;
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const prevEmail = user.email;

    if (newPassword || currentPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both currentPassword and newPassword are required' });
      }
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const hash = await bcrypt.hash(newPassword, 10);
      user.password = hash;
      await user.save();

      $setCompany.password = hash;
    }

    if (normalizedEmail && normalizedEmail !== prevEmail) {
      user.email = normalizedEmail;
      await user.save();
    }

    const updatedCompany = await ComapnyModel.findByIdAndUpdate(
      companyId,
      { $set: $setCompany },
      { new: true, runValidators: true },
    ).select('-password');

    if (!updatedCompany) {
      if (normalizedEmail && normalizedEmail !== prevEmail) {
        user.email = prevEmail;
        await user.save();
      }
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json({
      message: 'Company updated successfully',
      company: updatedCompany,
    });
  } catch (err) {
    console.error('Update company data error:', err);
    return res.status(500).json({ message: 'Error while updating company data' });
  }
});
export default router
