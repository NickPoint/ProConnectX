package com.nick1est.proconnectx.mock;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.Faq;
import com.nick1est.proconnectx.dto.WorkflowStep;
import com.nick1est.proconnectx.repository.*;
import com.nick1est.proconnectx.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.val;

import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DevDataInitializer {

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
    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    @PostConstruct
    public void init() {
        val values = RoleType.values();
        for (RoleType value : values) {
            Role role = new Role();
            role.setName(value);
            roleRepository.save(role);
        }

        for (CategoryType value : CategoryType.values()) {
            Category category = new Category();
            category.setName(value);
            categoryRepository.save(category);
        }

        val address = new Address();
        address.setCity("Wurzrsburg");
        address.setCountry("Germany");
        address.setPostalCode("12345");
        address.setStreet("Love");
        address.setRegion("Bavaria");
        address.setHouseNumber("20");
        addressRepository.save(address);

        val principal1 = new Principal();
        principal1.setEmail("freelancer@gmail.com");
        principal1.setPassword(encoder.encode("12345678"));
        roleRepository.findByName(RoleType.ROLE_FREELANCER).ifPresent(role -> principal1.setRoles(Set.of(role)));
        principalRepository.save(principal1);
        val freelancer = new Freelancer();
        freelancer.setAddress(address);
        freelancer.setFirstName("Freelancer");
        freelancer.setLastName("Freelancer");
        freelancer.setDescription("Test");
        freelancer.setPhoneNumber("+37287654321");
        freelancer.setActivationDate(OffsetDateTime.now());
        freelancer.setAccountStatus(AccountStatus.ACTIVE);
        freelancer.setPrincipal(principal1);
        freelancerRepository.save(freelancer);

        val employer = new Employer();
        val principal2 = new Principal();
        principal2.setEmail("employer@gmail.com");
        principal2.setPassword(encoder.encode("12345678"));
        roleRepository.findByName(RoleType.ROLE_EMPLOYER).ifPresent(role -> principal2.setRoles(Set.of(role)));
        principalRepository.save(principal2);
        employer.setCompanyName("Company Name");
        employer.setAddress(address);
        employer.setRegistrationCode("12345678");
        employer.setEmail("employer@gmail.com");
        employer.setDescription("test");
        employer.setPhoneNumber("+37212345678");
        employer.setActivationDate(OffsetDateTime.now());
        employer.setAccountStatus(AccountStatus.ACTIVE);
        employer.setPrincipal(principal2);
        employerRepository.save(employer);

        val client = new Client();
        client.setFirstName("Client");
        client.setLastName("Client");
        client.setAddress(address);
        val principalClient = new Principal();
        principalClient.setEmail("client@gmail.com");
        principalClient.setPassword(encoder.encode("12345678"));
        roleRepository.findByName(RoleType.ROLE_CLIENT).ifPresent(role -> principalClient.setRoles(Set.of(role)));;
        principalRepository.save(principalClient);
        client.setPrincipal(principalClient);
        clientRepository.save(client);
        principalClient.setClient(client);
        principalRepository.save(principalClient);

        val category = categoryService.findByName(CategoryType.WEB_DESIGN);
        val projectFixed = Project.builder()
                .title("Test projectFixed")
                .description("Test description")
                .shortDescription("Test short description")
                .freelancer(freelancer)
                .budget(100.50)
                .categories(List.of(category))
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
                .categories(List.of(category))
                .status(ProjectStatus.OPEN)
                .location("Kyiv")
                .projectType(ProjectType.BID)
                .dueDate(OffsetDateTime.now().plusDays(7))
                .employer(employer)
                .build();

        val bids = new ArrayList<Bid>();
        for (int i = 0; i < 5; i++) {
            val bid = new Bid();
            bid.setAmount(50.0 + i * 10);
            bid.setFreelancer(freelancer);
            bid.setProject(projectBid);
            bid.setSubmittedAt(OffsetDateTime.now());
            bid.setCoverLetter("Cover letter " + i);
            bids.add(bid);
        }

        projectBid.setBids(bids);
        projectRepository.save(projectBid);

        val workflowStep1 = new WorkflowStep();
        workflowStep1.setTitle("Test step");
        workflowStep1.setDescription("Test step description");
        workflowStep1.setStepNumber(1);
        val workflowStep2 = new WorkflowStep();
        workflowStep2.setTitle("Test step");
        workflowStep2.setDescription("Test step description");
        workflowStep2.setStepNumber(1);

        val faqElement1 = new Faq();
        faqElement1.setQuestion("Test question");
        faqElement1.setAnswer("Test answer");
        val faqElement2 = new Faq();
        faqElement2.setQuestion("Test question");
        faqElement2.setAnswer("Test answer");

        val service = new Service();
        service.setFreelancer(freelancer);
        service.setTitle("Test service");
        service.setDescription("Professional WordPress site development, including custom themes, plugins, and responsive design. Enhance your online presence with a fully functional and visually appealing website tailored to your needs.");
        service.setPrice(100.0);
        service.setCategories(Collections.singletonList(category));
        service.setRating(4.6);
        service.setRatingCount(10);
        service.setWorkflow(List.of(workflowStep1, workflowStep2));
        service.setFaqs(List.of(faqElement1, faqElement2));
        service.setAddress(address);
        service.setImagesMeta(Collections.singletonList(new File()));
        serviceRepository.save(service);

        val reviewFromClient = new Review();
        reviewFromClient.setClient(client);
        reviewFromClient.setService(service);
        reviewFromClient.setBody("Test review");
        reviewFromClient.setRating(4.5);
        reviewRepository.save(reviewFromClient);

//        val order = new Order();
//        order.setService(service);
//        order.setClient(client);
//        order.setType(OrderType.SERVICE);
//        order.setAdditionalNotes("Additional notes");
//        orderRepository.save(order);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
