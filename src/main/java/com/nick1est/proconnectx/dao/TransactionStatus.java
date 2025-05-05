package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum TransactionStatus {
    /** Transaction created but not funded yet */
    PENDING,

    /** Funds received and held in escrow */
    ESCROWED,

    /** Payment has been released to the freelancer */
    RELEASED,

    /** Transaction was canceled before release (funds may be returned) */
    CANCELED,

    /** Funds were refunded to client */
    REFUNDED,

    /** Dispute raised while funds are in escrow */
    DISPUTED
}

//*PENDING
//
//Description: This status is applied when an order is created, but payment hasn't been processed yet. The system may be waiting for the client to initiate the payment.
//
//Flow: When a client places an order but hasn't paid, the transaction is marked as PENDING. Once payment is initiated, the system can move the transaction to the next step.
//
//Action: The client places the order, and the system waits for payment to be confirmed.
//
//ESCROWED
//
//Description: Once the payment has been processed, the funds are held in an escrow account. This is a neutral state where the funds are securely held until the work is completed and approved by the client.
//
//Flow: After the payment is confirmed, the transaction is moved to the ESCROWED status. The system locks the funds until the freelancer completes the work and the client approves it.
//
//Action: The platform ensures the funds are held safely in escrow. The freelancer begins working on the order.
//
//APPROVED
//
//Description: The client has reviewed and approved the completed work. This status means that the client is satisfied with the freelancer's work and gives permission to release the funds from escrow.
//
//Flow: Once the freelancer completes the work and submits it to the client, the client either accepts or requests revisions. If accepted, the transaction status becomes APPROVED.
//
//Action: The client confirms the work as complete, and the platform is ready to release funds to the freelancer.
//
//COMPLETED
//
//Description: The funds are successfully released to the freelancer. This happens after the client approves the work and the payment is released from escrow. The transaction is considered finished, and the freelancer receives the funds.
//
//Flow: After the client approves the work, the system processes the release of funds to the freelancer, and the status is updated to COMPLETED.
//
//Action: The freelancer receives the payment, and the transaction is officially complete.
//
//CANCELLED
//
//Description: The transaction has been cancelled, either by the client or the freelancer, and the payment is refunded. This can occur at any point before work completion if there’s a change of mind, dispute, or agreement to cancel the transaction.
//
//Flow: If either the client or freelancer cancels the order, the status changes to CANCELLED, and the funds are refunded to the client.
//
//Action: Refund the client and ensure the transaction is marked as CANCELLED. Both parties may be notified.
//
//DISPUTED
//
//Description: The transaction is under review due to a disagreement between the client and the freelancer, often due to a quality issue or missed deadline. The system may require mediation to resolve the issue.
//
//Flow: If the client or freelancer opens a dispute due to issues with the order, the status will change to DISPUTED. The platform may involve a dispute resolution process, which could involve holding funds in escrow while the issue is resolved.
//
//Action: Both parties provide evidence to support their case, and the platform decides on the outcome.
//
//REFUNDED
//
//Description: After the cancellation or dispute resolution, the payment is refunded to the client. This status is typically used after a refund is processed following a dispute or cancellation.
//
//Flow: Once a dispute is resolved or if the client requests a refund, the system will process the refund and change the status to REFUNDED.
//
//Action: Refund the payment to the client, and update the transaction status to REFUNDED.
//
//FAILED
//
//Description: The payment attempt failed for various reasons, such as issues with the payment gateway or insufficient funds.
//
//Flow: If the client’s payment fails during processing, the transaction status changes to FAILED. The client would likely be prompted to retry the payment.
//
//Action: Notify the client of the failure and request a new payment attempt.
//
//SETTLED
//
//Description: This status is applied after the funds have been fully processed, and the transaction is fully complete. This includes the final settlement of funds (e.g., deducting platform fees).
//
//Flow: After the funds are released from escrow to the freelancer, and the platform completes any necessary deductions (like platform fees), the transaction is marked as SETTLED.
//
//Action: The freelancer receives the final payment after platform deductions, and the transaction is closed.
//
//IN_PROCESS
//
//Description: This status indicates that the transaction is being processed. This might be used during the verification or processing phase, especially in the case of payment gateway validation or internal processing.
//
//Flow: The system is still verifying the payment or completing initial steps like confirming the availability of funds or validating account details.
//
//Action: Ensure payment processing is ongoing. No action is required from the client or freelancer during this stage unless there’s a system failure or timeout.
//
//ON_HOLD
//
//Description: The transaction is temporarily paused due to an issue that requires investigation. This could happen due to fraud checks, manual verification, or incomplete data.
//
//Flow: If a red flag is raised during the transaction (e.g., fraud checks, incorrect details), the transaction is placed ON_HOLD until the issue is resolved.
//
//Action: Investigate the issue and either approve, reject, or process the transaction accordingly.
//
//Typical Flow in an Escrow System:
//Client places an order → Transaction status: PENDING
//
//Client makes payment → Transaction status: ESCROWED
//
//Freelancer completes work → Transaction status: ESCROWED
//
//Client approves work → Transaction status: APPROVED
//
//Payment released to freelancer → Transaction status: COMPLETED
//
//Refund or cancellation (if applicable) → Transaction status: CANCELLED or REFUNDED
//
//Dispute (if applicable) → Transaction status: DISPUTED
//
//Final settlement (fees deducted) → Transaction status: SETTLED*/