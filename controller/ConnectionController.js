import {
  getConnections,
  getPendingConneectionRequests,
  removeConnection,
  respondToConnectionRequest,
  sendConnectionRequest,
} from "../utils/connection.js";

export async function sendConnectionRequestController(req, res) {
  const senderId = req.user.id;
  const { receiverId } = req.body;
  try {
    const connectionRequest = await sendConnectionRequest(senderId, receiverId);
    return res.status(201).json({
      message: "Connection request sent successfully",
      connectionRequest,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to send connection",
    });
  }
}

export async function getPendingConnectionRequestsController(req, res) {
  const userId = req.user.id;

  try {
    const pending = await getPendingConneectionRequests(userId);
    const incoming = pending.filter((user)=>user.receiverId==userId);
    const outgoing = pending.filter((user)=>user.senderId==userId);
    return res.status(200).json({ pendingRequest:{incoming,outgoing} });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch pending requests" });
  }
}

export async function respondToConnectionRequestController(req, res) { 
  const { connectionId } = req.body;

  const { status } = req.body; // ACCEPTED and REJECTED bhejna bhai

  try {
    const updatedRequest = await respondToConnectionRequest(
      connectionId,
      status
    );
    return res.status(200).json({
      message: "Respose sent successfully",
      updatedRequest,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to respond",
    });
  }
}

export async function getConnectionsController(req,res) {
  const userId = req.user.id

  try {
    const connections = await getConnections(userId)
    const followers = connections.filter((connection)=>connection.receiverId==userId)
    const following = connections.filter((connection)=>connection.senderId==userId)
    return res.status(200).json({followers,following})
  }catch(e) {
    res.status(500).json({message: "Failed to get connections"})
  }
}

export async function removeConnectionController(req,res) {
  const connectionId = req.body

  try{
    const deletedConnection = await removeConnection(connectionId)
    
    return res.status(200).json({
      message: "Connection removed successfully",
      deletedConnection
    })
  }catch(e) {
    return res.status(500).json({
      message: "Failed to remove connection"
    })
  }
}