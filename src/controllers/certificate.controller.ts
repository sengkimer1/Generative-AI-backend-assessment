import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Certificate } from "../entity/certificate.entity";
import { UserInfo } from "../entity/user.entity";

export const CreateCertificate = async (req: Request, res: Response) => {
    const CertificateRepo = AppDataSource.getRepository(Certificate);
    const { courseName } = req.body;

    if (!courseName) {
        return res.status(400).json({ message: "CourseName is required." });
    }
    const course = courseName;
    try {
        const user = await AppDataSource.getRepository(UserInfo).findOne({ where: { id: req.user?.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const newCertificate = CertificateRepo.create({
            courseName: course,
            user: user,
        });
        await CertificateRepo.save(newCertificate);
        return res.status(201).json({ 
            message: "Certificate created successfully",
            Id:newCertificate.id,
            userId: newCertificate.user.id,
            courseName: newCertificate.courseName,
            createAt:newCertificate.createdAt
         });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getCertificate = async (req: Request, res: Response) => {
    const CertificateRepo = AppDataSource.getRepository(Certificate);
    const { userId } = req.params;

    try {
        const certificates = await CertificateRepo.find({
            where: {
                user: { id: userId }
            },
        });
        console.log(certificates);
        if (!certificates.length) {
            return res.status(404).json({ message: "No certificates found for this user" });
        }

        return res.status(200).json(certificates.map(certificate => ({
            id: certificate.id,
            userId: certificate.user.id,
            courseName: certificate.courseName,
            createdAt: certificate.createdAt,
        })));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getCertificateById = async (req: Request, res: Response) => {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const { id } = req.params;

    try {
        const certificate = await certificateRepo.findOne({
            where: { id },
            relations: ["user"],
            select: ["id", "courseName", "createdAt"] 
        });

        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found" });
        }

        return res.status(200).json(certificate);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching certificate" });
    }
};



export const deleteCertificate = async (req: Request, res: Response) => {
    const CertificateRepo = AppDataSource.getRepository(Certificate);
    const { id } = req.params;
    try {
        const certificate = await CertificateRepo.findOne({ where: { id } });
        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found" });
            }
            await CertificateRepo.delete({ id });
            return res.status(200).json({ message: "Certificate deleted successfully" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
                }
                };
