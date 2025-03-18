package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.BidStatus;
import com.nick1est.proconnectx.dto.BidCardDto;
import com.nick1est.proconnectx.dto.BidRequest;
import com.nick1est.proconnectx.mapper.BidMapper;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.ProjectRepository;
import com.nick1est.proconnectx.repository.BidRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class BidService {
    private final BidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final FreelancerRepository freelancerRepository;
    private final BidMapper bidMapper;

    public Bid approveBid(Long bidId) {
        log.info("Approving bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setStatus(BidStatus.APPROVED);
        return bid;
    }

    public Bid declineBid(Long bidId) {
        log.info("Decline bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setStatus(BidStatus.DECLINED);
        return bid;
    }

    public Bid reviewBid(Long bidId) {
        log.info("Review bid with id {}", bidId);
        val bid = bidRepository.findById(bidId).orElseThrow(
                () -> new EntityNotFoundException("Bid with id " + bidId + " not found"));

        bid.setStatus(BidStatus.IN_REVIEW);
        return bid;
    }

    public void makeBid(Long projectId, BidRequest bidRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("Making bid for freelancer with id {} for project with id {}", userDetails.getId(), projectId);
        val freelancer = freelancerRepository.findById(userDetails.getId()).orElseThrow(
                () -> new EntityNotFoundException("Freelancer with id " + userDetails.getId() + " not found"));
        val project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("ProjectCreateDto with id " + projectId + " not found"));

        val bid = Bid.builder()
                .bidder(freelancer)
                .project(project)
                .coverLetter(bidRequest.getCoverLetter())
                .amount(bidRequest.getAmount())
                .dueDate(bidRequest.getDueDate()).build();

        bidRepository.save(bid);
    }

    public List<BidCardDto> findFilteredBids(Long projectId, Integer rating, String firstName,
                                             String lastName, Integer minPrice, Integer maxPrice, List<BidStatus> statuses) {
        log.info("Finding filtered bids");
        if (statuses != null && statuses.isEmpty()) {
            statuses = null; //TODO: workaround for empty statuses list because JPA doesn't support checking empty list
        }
        val bids = bidRepository.filterBids(projectId, rating, firstName, lastName, minPrice, maxPrice, statuses);

        return bidMapper.toBidCardDto(bids);
    }

}
