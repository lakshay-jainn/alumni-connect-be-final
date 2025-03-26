import { Router } from "express";
import { sendConnectionRequestController, getPendingConnectionRequestsController, respondToConnectionRequestController, getConnectionsController , removeConnectionController } from "../../../controller/ConnectionController.js";

const router = Router()

router.get("/pending-connections" , getPendingConnectionRequestsController)
router.get("/connections", getConnectionsController)
router.post("/send-connection" , sendConnectionRequestController)
router.post("/response-connection" , respondToConnectionRequestController)
router.delete("/connection" , removeConnectionController)


export default router;