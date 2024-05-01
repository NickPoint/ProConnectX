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
import java.util.ArrayList;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final Integer NUMBER_OF_CLIENTS = 15;
    private final Integer NUMBER_OF_FREELANCERS = 15;

    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder encoder;
    private final CategoryService categoryService;
    private final ProjectRepository projectRepository;
    private final BidRepository bidRepository;

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

        Client client = new Client(
                "Mykyta Voievudskyi",
                "nikita.voevudsky@gmail.com",
                encoder.encode("12345678"));
        clientRepository.save(client);

        val project = Project.builder()
                .title("Test project")
                .description("Test description")
                .shortDescription("Test short description")
                .owner(client)
                .budget(100)
                .category(categoryService.findByName(ECategory.WEB_DESIGN))
                .status(ProjectStatus.OPEN)
                .location("Kyiv")
                .datePosted(OffsetDateTime.now())
                .dueDate(OffsetDateTime.now().plusDays(7))
                .build();

        projectRepository.save(project);

        val bids = new ArrayList<Bid>();
        for (int i = 0; i < 5; i++) {
            Bid bid = Bid.builder()
                    .amount(50 + i * 10)
                    .freelancer(client)
                    .project(project)
                    .bidStatus(BidStatus.NEW)
                    .datePosted(OffsetDateTime.now())
                    .build();
            bids.add(bid);
        }

        bidRepository.saveAll(bids);

        project.setBids(bids);



//        List<Client> clients = new ArrayList<>();
//        for (int i = 0; i < NUMBER_OF_CLIENTS; i++) {
//            Faker faker = new Faker();
//            Client client = new Client(
//                    faker.name().fullName(),
//                    faker.internet().emailAddress(),
//                    encoder.encode(faker.internet().password()));
//            clients.add(client);
//        }
//
//        clientRepository.saveAll(clients);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
