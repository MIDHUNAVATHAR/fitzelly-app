# Clean Architecture Structure - Gym Authentication Module

## Folder Structure

```
src/modules/gym/authentication/
├── domain/
│   ├── entities/
│   │   └── Gym.ts
│   └── repositories/
│       └── IGymRepository.ts
│
├── application/
│   ├── usecases/
│   │   ├── InitiateSignupUseCase.ts
│   │   ├── SignupGymUseCase.ts
│   │   └── LoginGymUseCase.ts
│   ├── dtos/
│   │   ├── LoginGymDTO.ts
│   │   └── SignupGymDTO.ts
│   └── mappers/
│       └── GymDTOMapper.ts
│
├── infrastructure/
│   ├── database/
│   │   └── mongoose/
│   │       ├── GymSchema.ts
│   │       └── OtpSchema.ts
│   ├── repositories/
│   │   └── GymRepositoryImpl.ts
│   ├── services/
│   │   └── TokenService.ts
│   ├── http/
│   │   └── middlewares/
│   │       └── auth.middleware.ts
│   └── mappers/
│       └── GymPersistenceMapper.ts
│
└── presentation/
    ├── controllers/
    │   └── GymController.ts
    └── routes/
        └── gym.routes.ts
```

## Layer Responsibilities

### Domain Layer
- **Entities**: Core business objects (Gym)
- **Repositories**: Interfaces defining data access contracts
- **Pure business logic, no external dependencies**

### Application Layer
- **Use Cases**: Business logic orchestration
- **DTOs**: Data Transfer Objects for input/output
- **Mappers**: Transform between domain entities and DTOs
- **Depends only on Domain layer**

### Infrastructure Layer
- **Database**: Mongoose schemas and models
- **Repositories**: Concrete implementations of repository interfaces
- **Services**: External services (TokenService)
- **HTTP**: Middlewares for HTTP concerns
- **Mappers**: Transform between persistence models and domain entities
- **Implements interfaces from Domain layer**

### Presentation Layer
- **Controllers**: Handle HTTP requests/responses
- **Routes**: Define API endpoints
- **Depends on Application and Infrastructure layers**

## SOLID Principles Applied

1. **Single Responsibility**: Each class has one reason to change
   - Controllers handle HTTP
   - Use Cases handle business logic
   - Repositories handle data access

2. **Open/Closed**: Open for extension, closed for modification
   - Repository interfaces allow different implementations
   - Use Cases work with abstractions

3. **Liskov Substitution**: Implementations can replace interfaces
   - GymRepositoryImpl can replace IGymRepository

4. **Interface Segregation**: Specific interfaces
   - IGymRepository defines only gym-related operations

5. **Dependency Inversion**: Depend on abstractions
   - Use Cases depend on IGymRepository interface, not concrete implementation
   - Controllers inject repositories into use cases

## Key Files

### Entry Point
- `src/app.ts` - Imports gymAuthRouter
- `src/modules/gym/authentication/presentation/routes/gym.routes.ts` - Defines routes

### Authentication Flow
1. Client → Routes → Controller
2. Controller → Use Case (with Repository)
3. Use Case → Domain Logic → Repository
4. Repository → Database
5. Response flows back through layers

## Benefits

- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Flexibility**: Can swap implementations (e.g., different databases)
- **Independence**: Domain logic independent of frameworks
