import { StatusCodes } from "http-status-codes";
import { invitationService } from "~/services/invitationServices";

const createNewBoardInvitation = async (req, res, next) => {
  try {
    // User thực hiện request này chính là Inviter – người đi mời const inviterId = req.jwtDecoded._id
    const inviterId = req.jwtDecoded._id;
    const resInvitation = await invitationService.createNewBoardInvitation(
      req.body,
      inviterId
    );
    res.status(StatusCodes.CREATED).json(resInvitation);
  } catch (error) {
    next(error);
  }
};
const getInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const resInvitation = await invitationService.getInvitation(userId);
    res.status(StatusCodes.OK).json(resInvitation);
  } catch (error) {
    next(error);
  }
};
const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { invitationId } = req.params;
    const { status } = req.body;
    const resInvitation = await invitationService.updateBoardInvitation(
      userId,
      invitationId,
      status
    );
    res.status(StatusCodes.OK).json(resInvitation);
  } catch (error) {
    next(error);
  }
};
export const invitationController = {
  createNewBoardInvitation,
  getInvitation,
  updateBoardInvitation,
};
