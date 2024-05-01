package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.BidStatus;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.ProjectRepository;
import com.nick1est.proconnectx.repository.BidRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class BidService {
    private final BidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;

    @Autowired
    public BidService(BidRepository bidRepository,
                           ClientRepository clientRepository,
                           ProjectRepository projectRepository) {
        this.bidRepository = bidRepository;
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
    }

    public Bid approveBid(Long bidId) {
        log.info("Approving bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setBidStatus(BidStatus.APPROVED);
        return bid;
    }

    public Bid declineBid(Long bidId) {
        log.info("Decline bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setBidStatus(BidStatus.DECLINED);
        return bid;
    }

    public Bid reviewBid(Long bidId) {
        log.info("Review bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setBidStatus(BidStatus.IN_REVIEW);
        return bid;
    }

    public Bid makeBid(Long freelancerId, Long projectId, String description, Integer price) {
        log.info("Making bid for freelancer with id {} for project with id {}", freelancerId, projectId);
        val freelancer = clientRepository.findById(freelancerId).orElseThrow(
                () -> new EntityNotFoundException("Client with id " + freelancerId + " not found"));
        val project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("ProjectCreateDto with id " + projectId + " not found"));

        val bid = new Bid();
        bid.setFreelancer(freelancer);
        bid.setProject(project);

        return bidRepository.save(bid);
    }

}
