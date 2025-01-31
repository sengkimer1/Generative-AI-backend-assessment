import { Router } from "express";
import { CreateCertificate,getCertificate,getCertificateById,deleteCertificate } from "../controllers/certificate.controller";
import protectRoute from "../middleware/auth";

const router = Router();

router.post("/create",protectRoute(), CreateCertificate);
router.get("/:userId",getCertificate);
router.get("/getbyId/:id",getCertificateById);
router.delete("/:id", deleteCertificate);
export default router;
