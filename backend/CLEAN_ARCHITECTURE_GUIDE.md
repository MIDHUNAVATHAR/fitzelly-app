# 🎓 Clean Architecture & SOLID Principles - Beginner's Guide

> **For**: Developers new to Clean Architecture  
> **Project**: Fitzelly SaaS - Gym Authentication Module  
> **Goal**: Understand why and how we structure our code

---

## 📚 Table of Contents

1. [What is Clean Architecture?](#what-is-clean-architecture)
2. [The Four Layers Explained](#the-four-layers-explained)
3. [SOLID Principles in Action](#solid-principles-in-action)
4. [Why DTOs? Why Mappers?](#why-dtos-why-mappers)
5. [Real Code Examples](#real-code-examples)
6. [Common Questions](#common-questions)

---

## 🏗️ What is Clean Architecture?

### The Problem It Solves

Imagine building a house where:
- The kitchen is built into the bathroom
- You can't change the windows without rebuilding walls
- Moving furniture requires rewiring electricity

**That's what happens with bad code architecture!**

### The Solution: Separation of Concerns

Clean Architecture separates your code into **layers**, like floors in a building:

```
┌─────────────────────────────────────┐
│   Presentation (4th Floor)          │  ← User Interface
│   Controllers, Routes               │
├─────────────────────────────────────┤
│   Application (3rd Floor)           │  ← Business Logic
│   Use Cases, DTOs, Mappers          │
├─────────────────────────────────────┤
│   Infrastructure (2nd Floor)        │  ← External Tools
│   Database, Services, HTTP          │
├─────────────────────────────────────┤
│   Domain (1st Floor/Foundation)     │  ← Core Business
│   Entities, Interfaces              │
└─────────────────────────────────────┘
```

**Key Rule**: Upper floors can use lower floors, but NOT vice versa!

---

## 🎯 The Four Layers Explained

### 1️⃣ Domain Layer (The Foundation)

**What**: Your core business logic and rules  
**Location**: `src/modules/gym/authentication/domain/`

#### What Lives Here:

**Entities** (`entities/Gym.ts`):
```typescript
// This is a Gym - the core concept of our business
export class Gym {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public passwordHash: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}
```

**Think of it as**: The blueprint of what a "Gym" is in real life.

**Repository Interfaces** (`repositories/IGymRepository.ts`):
```typescript
// This defines WHAT we can do with gyms, not HOW
export interface IGymRepository {
    create(gym: Gym): Promise<Gym>;
    findByEmail(email: string): Promise<Gym | null>;
    findById(id: string): Promise<Gym | null>;
}
```

**Think of it as**: A contract that says "whoever stores gyms must be able to do these things."

#### Why This Layer Exists:
- ✅ Business rules stay pure (no database code mixed in)
- ✅ Can change database without touching business logic
- ✅ Easy to test (no external dependencies)

---

### 2️⃣ Application Layer (The Brain)

**What**: Orchestrates business operations  
**Location**: `src/modules/gym/authentication/application/`

#### What Lives Here:

**Use Cases** (`usecases/LoginGymUseCase.ts`):
```typescript
export class LoginGymUseCase {
    constructor(private gymRepository: IGymRepository) {}

    async execute(request: LoginGymRequestDTO): Promise<LoginGymResponseDTO> {
        // Step 1: Find gym by email
        const gym = await this.gymRepository.findByEmail(request.email);
        
        // Step 2: Check password
        const isValid = await bcrypt.compare(request.password, gym.passwordHash);
        
        // Step 3: Generate tokens
        const tokens = TokenService.generateTokens(gym.id);
        
        // Step 4: Return response
        return GymDTOMapper.toResponseDTO(gym, tokens);
    }
}
```

**Think of it as**: A recipe that says "to login, do steps 1, 2, 3, 4 in order."

**DTOs** (`dtos/LoginGymDTO.ts`):
```typescript
// What data comes IN
export interface LoginGymRequestDTO {
    email: string;
    password: string;
}

// What data goes OUT
export interface LoginGymResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
```

**Think of it as**: The format for input/output, like a form template.

**Mappers** (`mappers/GymDTOMapper.ts`):
```typescript
export class GymDTOMapper {
    static toResponseDTO(gym: Gym, accessToken: string, refreshToken: string) {
        return {
            accessToken,
            refreshToken,
            user: {
                id: gym.id,
                name: gym.name,
                email: gym.email
            }
        };
    }
}
```

**Think of it as**: A translator that converts internal data to external format.

#### Why This Layer Exists:
- ✅ Business logic is reusable (can use same login logic for web, mobile, API)
- ✅ Input/output is controlled (security!)
- ✅ Changes to UI don't break business logic

---

### 3️⃣ Infrastructure Layer (The Tools)

**What**: Handles external systems (database, email, tokens)  
**Location**: `src/modules/gym/authentication/infrastructure/`

#### What Lives Here:

**Repository Implementation** (`repositories/GymRepositoryImpl.ts`):
```typescript
export class GymRepositoryImpl implements IGymRepository {
    async create(gym: Gym): Promise<Gym> {
        // THIS is where we actually talk to MongoDB
        const newGym = new GymModel({
            name: gym.name,
            email: gym.email,
            passwordHash: gym.passwordHash
        });
        await newGym.save();
        return GymPersistenceMapper.toDomain(newGym);
    }
}
```

**Think of it as**: The actual worker that does the database operations.

**Database Schemas** (`database/mongoose/GymSchema.ts`):
```typescript
const gymSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});
```

**Think of it as**: The actual table structure in the database.

**Services** (`services/TokenService.ts`):
```typescript
export class TokenService {
    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    }
}
```

**Think of it as**: A tool that creates JWT tokens.

#### Why This Layer Exists:
- ✅ Can swap MongoDB for PostgreSQL without touching business logic
- ✅ External dependencies are isolated
- ✅ Easy to mock for testing

---

### 4️⃣ Presentation Layer (The Face)

**What**: Handles HTTP requests and responses  
**Location**: `src/modules/gym/authentication/presentation/`

#### What Lives Here:

**Controllers** (`controllers/GymController.ts`):
```typescript
export class GymController {
    static async login(req: Request, res: Response) {
        // 1. Get data from HTTP request
        const { email, password } = req.body;
        
        // 2. Create use case with repository
        const useCase = new LoginGymUseCase(new GymRepositoryImpl());
        
        // 3. Execute business logic
        const result = await useCase.execute({ email, password });
        
        // 4. Set cookies
        res.cookie('accessToken', result.accessToken, { httpOnly: true });
        
        // 5. Send HTTP response
        res.json({ status: "success", user: result.user });
    }
}
```

**Think of it as**: The receptionist who receives requests and sends responses.

**Routes** (`routes/gym.routes.ts`):
```typescript
router.post('/login', GymController.login);
router.post('/logout', GymController.logout);
router.get('/auth/me', authenticate, GymController.verifyToken);
```

**Think of it as**: The directory that says "for /login, go to login controller."

#### Why This Layer Exists:
- ✅ HTTP concerns separated from business logic
- ✅ Can add GraphQL alongside REST without changing business logic
- ✅ Easy to add authentication, validation, etc.

---

## 🎨 SOLID Principles in Action

### S - Single Responsibility Principle

**Rule**: Each class should have ONE job and ONE reason to change.

**Example**:
```typescript
// ❌ BAD: One class doing everything
class GymService {
    login() { /* validate, check DB, generate token, send email */ }
}

// ✅ GOOD: Each class has one job
class LoginGymUseCase {
    execute() { /* orchestrate login flow */ }
}
class GymRepositoryImpl {
    findByEmail() { /* only database operations */ }
}
class TokenService {
    generateToken() { /* only token generation */ }
}
```

**Why**: If you need to change how tokens work, you only touch `TokenService`, not everything!

---

### O - Open/Closed Principle

**Rule**: Open for extension, closed for modification.

**Example**:
```typescript
// ✅ GOOD: Interface allows different implementations
interface IGymRepository {
    findByEmail(email: string): Promise<Gym | null>;
}

// Can add new implementation WITHOUT changing existing code
class MongoGymRepository implements IGymRepository { }
class PostgresGymRepository implements IGymRepository { }
class InMemoryGymRepository implements IGymRepository { } // For testing!
```

**Why**: Add new features without breaking existing code!

---

### L - Liskov Substitution Principle

**Rule**: Subtypes must be substitutable for their base types.

**Example**:
```typescript
// Use case works with ANY repository implementation
class LoginGymUseCase {
    constructor(private gymRepository: IGymRepository) {}
    // Works with Mongo, Postgres, or InMemory - doesn't care!
}
```

**Why**: Can swap implementations without breaking anything!

---

### I - Interface Segregation Principle

**Rule**: Don't force classes to implement methods they don't need.

**Example**:
```typescript
// ✅ GOOD: Specific interface
interface IGymRepository {
    create(gym: Gym): Promise<Gym>;
    findByEmail(email: string): Promise<Gym | null>;
    findById(id: string): Promise<Gym | null>;
}

// ❌ BAD: Fat interface
interface IRepository {
    create(), update(), delete(), findById(), findByEmail(),
    findByName(), findByDate(), exportToCSV(), sendEmail() // Too much!
}
```

**Why**: Keep interfaces focused and simple!

---

### D - Dependency Inversion Principle

**Rule**: Depend on abstractions, not concrete implementations.

**Example**:
```typescript
// ✅ GOOD: Depends on interface (abstraction)
class LoginGymUseCase {
    constructor(private gymRepository: IGymRepository) {}
}

// ❌ BAD: Depends on concrete class
class LoginGymUseCase {
    constructor(private gymRepository: MongoGymRepository) {}
    // Now locked to MongoDB forever!
}
```

**Why**: Easy to test, easy to swap implementations!

---

## 🔄 Why DTOs? Why Mappers?

### What are DTOs?

**DTO = Data Transfer Object**

Think of DTOs as **envelopes** for sending data:

```typescript
// The envelope for LOGIN REQUEST
interface LoginGymRequestDTO {
    email: string;
    password: string;
}

// The envelope for LOGIN RESPONSE
interface LoginGymResponseDTO {
    accessToken: string;
    user: { id, name, email };
}
```

### Why Use DTOs?

#### 1. **Security** 🔒
```typescript
// ❌ BAD: Sending entire entity
return gym; // Includes passwordHash! DANGER!

// ✅ GOOD: Only send what's needed
return {
    user: {
        id: gym.id,
        name: gym.name,
        email: gym.email
        // No password!
    }
};
```

#### 2. **Validation** ✅
```typescript
interface LoginGymRequestDTO {
    email: string;     // Must be string
    password: string;  // Must be string
    // If client sends extra fields, they're ignored!
}
```

#### 3. **API Stability** 🛡️
```typescript
// Internal entity can change
class Gym {
    id, name, email, passwordHash, 
    createdAt, updatedAt, deletedAt, version, etc.
}

// But API response stays the same
interface LoginGymResponseDTO {
    user: { id, name, email }
    // Clients don't break when we add fields to Gym!
}
```

### What are Mappers?

**Mappers = Translators**

They convert between different formats:

```typescript
export class GymDTOMapper {
    // Translate: Domain Entity → DTO (for API response)
    static toResponseDTO(gym: Gym, tokens): LoginGymResponseDTO {
        return {
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            user: {
                id: gym.id,
                name: gym.name,
                email: gym.email
                // Filtering out sensitive data!
            }
        };
    }
}
```

### Why Use Mappers?

#### 1. **Separation of Concerns**
```typescript
// Domain entity (internal)
class Gym {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public passwordHash: string,  // Internal only!
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}

// DTO (external)
interface GymResponseDTO {
    id: string;
    name: string;
    email: string;
    // No password, no dates - just what API needs
}
```

#### 2. **Centralized Transformation Logic**
```typescript
// All transformations in ONE place
export class GymDTOMapper {
    static toResponseDTO(gym: Gym) { }
    static toListDTO(gyms: Gym[]) { }
    static toDetailDTO(gym: Gym) { }
}
```

#### 3. **Easy to Change**
```typescript
// Need to add a field to API? Change mapper only!
static toResponseDTO(gym: Gym) {
    return {
        id: gym.id,
        name: gym.name,
        email: gym.email,
        memberSince: gym.createdAt.toISOString() // New field!
    };
}
```

---

## 💡 Real Code Examples

### Example 1: Login Flow (Step by Step)

```
1. User submits login form
   ↓
2. POST /api/v1/gym-auth/login
   ↓
3. Router → GymController.login()
   ↓
4. Controller creates LoginGymUseCase
   ↓
5. Use Case calls GymRepositoryImpl.findByEmail()
   ↓
6. Repository queries MongoDB
   ↓
7. Repository uses GymPersistenceMapper.toDomain()
   ↓
8. Use Case validates password
   ↓
9. Use Case calls TokenService.generateTokens()
   ↓
10. Use Case calls GymDTOMapper.toResponseDTO()
    ↓
11. Controller sets cookies
    ↓
12. Controller sends JSON response
    ↓
13. User receives tokens
```

### Example 2: Why Layers Matter

**Scenario**: You want to switch from MongoDB to PostgreSQL

**Without Clean Architecture**:
```typescript
// ❌ BAD: Database code everywhere
class LoginController {
    async login(req, res) {
        const gym = await GymModel.findOne({ email }); // MongoDB specific!
        // Now you have to change EVERY controller!
    }
}
```

**With Clean Architecture**:
```typescript
// ✅ GOOD: Only change repository implementation
class PostgresGymRepository implements IGymRepository {
    async findByEmail(email: string) {
        return await this.db.query('SELECT * FROM gyms WHERE email = $1', [email]);
    }
}

// Controllers, Use Cases, Domain - UNCHANGED!
```

---

## ❓ Common Questions

### Q1: "Isn't this too much code for simple CRUD?"

**A**: For a tiny app, yes. But:
- Your app will grow
- Requirements will change
- You'll thank yourself later
- It's easier to start clean than refactor messy code

### Q2: "Why not just use MVC?"

**A**: MVC is great for simple apps, but:
- Business logic often ends up in controllers (fat controllers)
- Hard to test
- Hard to reuse logic
- Database changes break everything

### Q3: "Do I need all these layers for every feature?"

**A**: For complex features (auth, payments), yes. For simple features (get list of items), you can simplify.

### Q4: "What if I want to add a mobile app?"

**A**: Perfect! Just create new controllers/routes. Use cases and domain stay the same!

```
Web App → REST Controllers → Use Cases → Domain
Mobile App → GraphQL Resolvers → Use Cases → Domain
CLI Tool → CLI Commands → Use Cases → Domain
```

---

## 🎯 Quick Reference

### When to Create Each Component:

| Component | When to Create |
|-----------|----------------|
| **Entity** | New core business concept (User, Gym, Payment) |
| **Repository Interface** | Need to store/retrieve entities |
| **Repository Implementation** | Implementing storage (MongoDB, Postgres) |
| **Use Case** | New business operation (Login, Signup, Checkout) |
| **DTO** | New API endpoint (input/output format) |
| **Mapper** | Converting between entity and DTO |
| **Controller** | New HTTP endpoint |
| **Route** | Connecting URL to controller |

### Dependency Flow:

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure ←────┘
```

**Remember**: Dependencies point INWARD, never outward!

---

## 🚀 Next Steps

1. **Read the code** in this order:
   - Domain entities
   - Repository interfaces
   - Use cases
   - Controllers

2. **Try modifying**:
   - Add a new field to Gym entity
   - Create a new use case
   - Add a new endpoint

3. **Experiment**:
   - Write unit tests for use cases
   - Create a new feature following the same pattern

---

## 📖 Further Reading

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Remember**: Clean Architecture is about **maintainability**, **testability**, and **flexibility**. It might seem like more work upfront, but it pays off as your project grows! 🎉
