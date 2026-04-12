import { createNotification } from "./notificationService";
import { updateRequestStatus } from "./requestService";

export type DirectRequestResponse = "accepted" | "declined";

export async function respondToDirectRequest(input: {
  requestId: string;
  requestTitle: string;
  requesterId: string;
  helperName: string;
  response: DirectRequestResponse;
}) {
  if (input.response === "declined") {
    const { error: statusError } = await updateRequestStatus(input.requestId, "cancelled");
    if (statusError) {
      return { error: statusError };
    }
  }

  return await createNotification({
    user_id: input.requesterId,
    type: input.response === "accepted" ? "offer_accepted" : "offer_rejected",
    title: input.response === "accepted" ? "Direct request accepted" : "Direct request declined",
    message:
      input.response === "accepted"
        ? `${input.helperName} accepted your direct request "${input.requestTitle}".`
        : `${input.helperName} declined your direct request "${input.requestTitle}".`,
    related_id: input.requestId,
    related_type: "request",
  });
}
