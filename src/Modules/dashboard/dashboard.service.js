import { CompanyModel } from "../../DB/Models/company.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
export const banUser = async (req, res) => {

    const { userId } = req.params;
    

    const user = await dbService.findById({ model: UserModel, id: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Toggle the isBanned status
    const updatedUser = await dbService.findByIdAndUpdate({
      model: UserModel,
      id: userId,
      data: { isBanned: !user.isBanned,
       bannedAt: user.isBanned ? null : new Date()
       }
    });

    return res.status(200).json({
      message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
      updatedUser
    });
  
};

// ✅ Ban or Unban a Company
export const banCompany = async (req, res) => {

    const { companyId } = req.params;
    const company = await CompanyModel.findById(companyId);

    if (!company) return res.status(404).json({ message: "Company not found" });

    // Toggle the ban status
    const updatedCompany = await dbService.findByIdAndUpdate({
      model: CompanyModel,
      id: companyId,
      data: { isBanned: !company.isBanned,
       bannedAt: company.isBanned ? null : new Date()
       }
    });

    return res.status(200).json({
      message: company.isBanned ? "Company banned successfully" : "Company unbanned successfully",
      updatedCompany
    });
  
};


export const approveCompany = async (req, res) => {
  
    const { companyId } = req.params;
    const company = await CompanyModel.findById(companyId);

    if (!company) return res.status(404).json({ message: "Company not found" });

    // Set approval status
    company.approvedByAdmin = true;
    await company.save();

    return res.status(200).json({ message: "Company approved successfully", company });
  
};