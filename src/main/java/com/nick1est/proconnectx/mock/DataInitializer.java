package com.nick1est.proconnectx.mock;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.repository.*;
import com.nick1est.proconnectx.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.val;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final Integer NUMBER_OF_CLIENTS = 15;
    private final Integer NUMBER_OF_FREELANCERS = 15;

    private final PrincipalRepository principalRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder encoder;
    private final FreelancerRepository freelancerRepository;
    private final EmployerRepository employerRepository;
    private final CategoryService categoryService;
    private final ProjectRepository projectRepository;
    private final BidRepository bidRepository;
    private final ServiceRepository serviceRepository;

    @PostConstruct
    public void init() {
        val values = ERole.values();
        for (ERole value : values) {
            Role role = new Role(value);
            roleRepository.save(role);
        }

        for (ECategory value : ECategory.values()) {
            Category category = new Category(value);
            categoryRepository.save(category);
        }

        val principal1 = new Principal();
        principal1.setFirstName("Freelancer");
        principal1.setLastName("Freelancer");
        principal1.setEmail("freelancer@gmail.com");
        principal1.setPassword(encoder.encode("12345678"));
        roleRepository.findByName(ERole.ROLE_FREELANCER).ifPresent(role -> principal1.setRoles(Set.of(role)));
        principalRepository.save(principal1);
        val freelancer = new Freelancer();
        freelancer.setCountry("Estonia");
        freelancer.setFirstName("Freelancer");
        freelancer.setLastName("Freelancer");
        freelancer.setPhoneNumber("+37287654321");
        freelancer.setAddress("Tallinn, Estonia");
        freelancer.setActivationDate(OffsetDateTime.now());
        freelancer.setAccountStatus(AccountStatus.ACTIVE);
        freelancer.setPrincipal(principal1);
        freelancerRepository.save(freelancer);

        val employer = new Employer();
        val principal2 = new Principal();
        principal2.setEmail("employer@gmail.com");
        principal2.setFirstName("Employer");
        principal2.setLastName("Employer");
        principal2.setPassword(encoder.encode("12345678"));
        roleRepository.findByName(ERole.ROLE_EMPLOYER).ifPresent(role -> principal2.setRoles(Set.of(role)));
        principalRepository.save(principal2);
        employer.setCompanyName("Company Name");
        employer.setCountry("Estonia");
        employer.setRegistrationCode("12345678");
        employer.setEmail("employer@gmail.com");
        employer.setPhoneNumber("+37212345678");
        employer.setAddress("Tallinn, Estonia");
        employer.setActivationDate(OffsetDateTime.now());
        employer.setAccountStatus(AccountStatus.ACTIVE);
        employer.setPrincipal(principal2);
        employerRepository.save(employer);



        val projectFixed = Project.builder()
                .title("Test projectFixed")
                .description("Test description")
                .shortDescription("Test short description")
                .freelancer(freelancer)
                .budget(100.50)
                .categories(List.of(categoryService.findByName(ECategory.WEB_DESIGN)))
                .status(ProjectStatus.OPEN)
                .location("Kyiv")
                .projectType(ProjectType.FIXED)
                .dueDate(OffsetDateTime.now().plusDays(7))
                .employer(employer)
                .build();

        projectRepository.save(projectFixed);

        val projectBid = Project.builder()
                .title("Test projectBid")
                .description("Test description")
                .shortDescription("Test short description")
                .freelancer(freelancer)
                .categories(List.of(categoryService.findByName(ECategory.WEB_DESIGN)))
                .status(ProjectStatus.OPEN)
                .location("Kyiv")
                .projectType(ProjectType.BID)
                .dueDate(OffsetDateTime.now().plusDays(7))
                .employer(employer)
                .build();

        val bids = new ArrayList<Bid>();
        for (int i = 0; i < 5; i++) {
            Bid bid = Bid.builder()
                    .amount(50.0 + i * 10)
                    .bidder(freelancer)
                    .project(projectBid)
                    .status(BidStatus.NEW)
                    .datePosted(OffsetDateTime.now())
                    .build();
            bids.add(bid);
        }

        val bidWithShortCoverLetter = Bid.builder()
                .amount(100.0)
                .bidder(freelancer)
                .project(projectBid)
                .status(BidStatus.NEW)
                .datePosted(OffsetDateTime.now())
                .shortCoverLetter("Short cover letter")
                .build();

        val bidWithShortCoverLetter2 = Bid.builder()
                .amount(100.0)
                .bidder(freelancer)
                .project(projectBid)
                .status(BidStatus.NEW)
                .datePosted(OffsetDateTime.now())
                .shortCoverLetter("Short but no so short cover letter, a bit longer than the previous one")
                .build();

        bids.add(bidWithShortCoverLetter);
        bids.add(bidWithShortCoverLetter2);
        projectBid.setBids(bids);
        projectRepository.save(projectBid);

        val serviceDao = ServiceDao.builder()
                .title("Test service")
                .description("Test description")
                .freelancer(freelancer)
                .price(100)
                .category(categoryService.findByName(ECategory.WEB_DESIGN))
                .rating(4.6)
                .ratingCount(10)
                .location("Kyiv")
                .build();

        serviceRepository.save(serviceDao);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
