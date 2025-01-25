import { Router } from "express";
import { sendConnectionRequestController, getPendingConnectionRequestsController, respondToConnectionRequestController, getConnectionsController , removeConnectionController } from "../../../controller/ConnectionController.js";

const router = Router()

router.get("/pending-connection" , getPendingConnectionRequestsController)
router.get("/get-connection", getConnectionsController)
router.post("/send-connection" , sendConnectionRequestController)
router.post("/response-connection" , respondToConnectionRequestController)
router.delete("/delete-connection" , removeConnectionController)


export default router