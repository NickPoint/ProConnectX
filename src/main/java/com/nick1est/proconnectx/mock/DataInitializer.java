package com.nick1est.proconnectx.mock;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import jakarta.annotation.PostConstruct;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer {

    private final Integer NUMBER_OF_CLIENTS = 15;
    private final Integer NUMBER_OF_FREELANCERS = 15;

    private final ClientRepository clientRepository;
    private final FreelancerRepository freelancerRepository;

    @Autowired
    public DataInitializer(ClientRepository clientRepository, FreelancerRepository freelancerRepository) {
        this.clientRepository = clientRepository;
        this.freelancerRepository = freelancerRepository;
    }

    @PostConstruct
    public void init() {
        // Add some mock data
        List<Client> clients = new ArrayList<>();
        for (int i = 0; i < NUMBER_OF_CLIENTS; i++) {
            Faker faker = new Faker();
            Client client = new Client();
            client.setName(faker.name().fullName());
            client.setEmail(faker.internet().emailAddress());
            client.setLocation(faker.address().city());
            client.setRating(faker.random().nextDouble(0, 5));
            client.setPassword(faker.internet().password());


            clients.add(client);
        }

        clientRepository.saveAll(clients);

        List<Freelancer> freelancers = new ArrayList<>();
        for (int i = 0; i < NUMBER_OF_FREELANCERS; i++) {
            Faker faker = new Faker();
            Freelancer freelancer = new Freelancer();
            freelancer.setName(faker.name().fullName());
            freelancer.setEmail(faker.internet().emailAddress());
            freelancer.setLocation(faker.address().city());
            freelancer.setRating(faker.random().nextDouble(0, 5));
            freelancer.setPassword(faker.internet().password());

            freelancers.add(freelancer);
        }

        freelancerRepository.saveAll(freelancers);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumeration) {
        T[] values = enumeration.getEnumConstants();
        Random random = new Random();
        int index = random.nextInt(values.length);
        return values[index];
    }

}
