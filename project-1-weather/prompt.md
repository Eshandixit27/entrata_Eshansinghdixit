# Task 1 — Weather API Integration

## 1. Role

Act as a **Senior Full-Stack Software Engineer, Software Architect, Security Engineer, QA Engineer, UI/UX Engineer, and Code Reviewer**.

Your objective is to implement **Task 1 — Weather API Integration** as a production-quality, maintainable, secure, testable, and well-documented application.

The implementation must satisfy the provided coding challenge requirements before adding enhancements.

---

# 2. Primary Objective

Build a weather page that allows a user to:

1. Enter a city name.
2. Submit a search.
3. Fetch the current weather from a public weather API.
4. Display useful weather information.
5. Clearly communicate loading, success, validation, and failure states.

The minimum required weather information is:

* City
* Temperature
* Humidity
* Wind speed
* Weather condition

The application must be responsive for desktop and mobile users.

The challenge specifically requires loading states and useful error states for invalid cities, network failures, and API failures.

---

# 3. Engineering Priorities

Follow this strict priority order:

1. **Functional correctness**
2. **Complete MVP**
3. **Architecture and separation of concerns**
4. **Error handling**
5. **Edge cases**
6. **Automated tests**
7. **Security**
8. **UI/UX and accessibility**
9. **Documentation**
10. **Novel features**

Do not implement novel features until the mandatory functionality is working and tested.

A smaller, correct, secure, well-tested implementation is better than a large implementation with unreliable functionality.

---

# 4. Target Audience

The code will be evaluated by experienced software engineers and technical interviewers.

The end user may be a first-time user with no technical knowledge.

Therefore:

### Code

Use:

* professional engineering terminology
* clear naming
* maintainable abstractions
* explicit error handling
* explainable architecture

### User interface

Use:

* simple language
* obvious actions
* concise error messages
* clear loading states
* accessible controls

Do not expose technical implementation details to end users.

---

# 5. Scope

## Mandatory Scope

Implement:

* City search
* Weather API integration
* Input validation
* Loading state
* Successful weather display
* Invalid-city handling
* Network-failure handling
* API-failure handling
* External response validation
* Secure API credential management
* Automated tests
* Responsive UI
* Basic accessibility
* README documentation
* Prompt documentation

## Explicitly Avoid

Do not introduce unrelated features such as:

* authentication
* payments
* social accounts
* chat
* unrelated dashboards
* complex user management
* unnecessary microservices
* unnecessary databases
* unnecessary infrastructure

unless the existing repository already requires them.

---

# 6. Repository Inspection

Before changing code, inspect the repository completely.

Determine:

* programming language
* framework
* frontend architecture
* backend architecture
* existing API layer
* existing components
* existing services
* existing models/types
* existing tests
* package/dependency configuration
* environment configuration
* README
* build configuration
* lint/type-check configuration

Do not assume the technology stack.

Do not replace an existing framework simply because another framework is preferred.

Reuse existing infrastructure when reasonable.

Before implementation, establish:

```text
Existing Architecture
        ↓
Requirements
        ↓
Required Changes
        ↓
Testing Strategy
        ↓
Security Strategy
        ↓
Implementation
```

---

# 7. Architecture Requirements

Use clear separation of concerns.

Prefer a structure conceptually similar to:

```text
User Interface
      ↓
Controller / Request Handler
      ↓
Weather Service
      ↓
Weather API Client
      ↓
External Weather API
```

Separate responsibilities where appropriate:

```text
UI Components
Validation
Weather Service
API Client
Response Transformer
Weather Model
Error Types
Configuration
Tests
```

Do not put all API, validation, transformation, and UI logic into one component or file.

The external weather API response must not become the application's internal data model.

Use:

```text
External API Response
        ↓
Response Validation
        ↓
Transformation
        ↓
Internal Weather Model
        ↓
UI
```

This makes the application easier to test and maintain.

---

# 8. OOP Requirements

Use OOP where it provides practical value.

Possible responsibilities include:

```text
WeatherService
WeatherApiClient
WeatherResponseValidator
WeatherError
```

However:

**Do not create classes merely to demonstrate OOP.**

Use abstractions only when they improve:

* testability
* maintainability
* encapsulation
* extensibility
* separation of concerns

Follow SOLID principles where appropriate, especially:

* Single Responsibility Principle
* Dependency Inversion
* Open/Closed Principle

Avoid:

* God classes
* deep inheritance
* unnecessary interfaces
* excessive design patterns
* abstraction for abstraction's sake

Prefer composition over inheritance when appropriate.

---

# 9. API Integration

Integrate a reliable public weather API appropriate to the existing project.

Before implementation:

* determine the API's authentication mechanism
* determine required parameters
* determine relevant response fields
* determine HTTP error behavior
* determine rate-limit behavior
* determine reasonable timeout behavior

Do not assume that an external API is always available or always returns valid data.

The application must validate external responses before using them.

---

# 10. Security Requirements

Security is a mandatory requirement.

## 10.1 Secrets

Never hardcode:

* API keys
* access tokens
* passwords
* private credentials
* secrets

Use environment variables.

Example:

```env
WEATHER_API_KEY=
```

Create:

```text
.env.example
```

with placeholders only.

Never put a real credential in `.env.example`.

Ensure the actual environment file is ignored by Git.

---

# 11. API Credential Exposure

Determine whether the API key can remain server-side.

Preferred architecture when a backend exists:

```text
Browser
   ↓
Application Backend
   ↓
Weather API
```

Do not expose a server-side API key to browser JavaScript.

If the selected API requires a browser-exposed public key, follow the provider's intended model and document the limitation.

Never claim that a secret is secure if it is intentionally exposed to the browser.

---

# 12. Input Security and Validation

Treat all city input as untrusted.

Before making an API request:

1. Verify the input exists.
2. Trim whitespace.
3. Validate length.
4. Reject clearly invalid input.
5. Normalize input where appropriate.
6. Only then make the API request.

Example:

```text
Input:
"   Pune   "

Expected:
"Pune"
```

Example:

```text
Input:
""

Expected:
Validation error.
No API request.
```

Do not pass unvalidated input into:

* SQL
* shell commands
* filesystem operations
* executable code
* unsafe HTML
* dynamic code evaluation

Avoid unnecessary HTML injection risks.

Use framework-supported safe rendering mechanisms.

---

# 13. External Response Security

Treat the external weather API response as untrusted data.

Validate:

* HTTP status
* content type where relevant
* JSON structure
* required fields
* expected data types
* reasonable values

Example conceptual flow:

```text
HTTP Response
      ↓
Status Validation
      ↓
JSON Parsing
      ↓
Schema / Structure Validation
      ↓
Data Transformation
      ↓
Weather Model
```

If required data is missing, return a controlled application error.

Never allow malformed external data to crash the application.

---

# 14. Error Information Security

Never expose:

* API credentials
* Authorization headers
* stack traces
* filesystem paths
* internal service names
* database credentials
* internal debugging information

to end users.

Bad:

```text
Error: AxiosError at /home/user/project/src/services/weather.js
API_KEY=abc123
```

Good:

```text
Weather service is temporarily unavailable.
Please try again.
```

Detailed logs may be used internally but must not contain secrets.

---

# 15. Logging

Use meaningful logs where appropriate.

Log useful diagnostic information such as:

* operation
* error category
* HTTP status
* request correlation information where available

Do not log:

* API keys
* authorization headers
* passwords
* tokens
* sensitive user information

Do not leave unnecessary debugging logs in the final implementation.

---

# 16. Required UI States

The application must explicitly support the following states.

## 16.1 Initial State

Example:

```text
Enter a city to see the current weather.
```

The user should immediately understand what to do.

## 16.2 Loading State

Example:

```text
Fetching weather...
```

The loading state must appear while the request is running.

Prevent confusing duplicate requests where appropriate.

## 16.3 Successful State

Example:

```text
Pune

28°C
Cloudy

Humidity: 72%
Wind: 12 km/h
```

The information should be easy to scan.

## 16.4 Invalid Input

Example:

```text
Please enter a city name.
```

## 16.5 City Not Found

Example:

```text
We couldn't find weather information for that city.
Please check the spelling and try again.
```

## 16.6 Network/API Failure

Example:

```text
Weather service is temporarily unavailable.
Please try again.
```

Where appropriate, provide:

```text
[Retry]
```

The UI must not become blank or unusable after an expected error.

---

# 17. Error Categories

Handle at minimum:

```text
ValidationError
CityNotFoundError
NetworkError
TimeoutError
RateLimitError
ExternalServiceError
InvalidResponseError
ConfigurationError
```

Use idiomatic error handling for the chosen programming language.

Do not silently swallow errors.

Bad:

```text
try:
    fetchWeather()
except:
    pass
```

Errors must either be:

* handled meaningfully
* transformed into an appropriate application error
* logged safely and propagated

---

# 18. API Rate Limits and Timeouts

Implement reasonable protection against unreliable external services.

At minimum:

* reasonable request timeout
* handling of rate-limit responses
* controlled failure behavior
* no infinite retry loop
* no uncontrolled request flooding

If retry behavior is implemented:

* limit retry attempts
* use appropriate backoff where necessary
* do not retry validation errors
* do not retry indefinitely

---

# 19. Testing Requirements

Tests must prove actual behavior.

Do not write tests merely to increase coverage.

At minimum include:

### Test 1 — Valid City

```text
Input:
Pune

Expected:
Weather data returned successfully.
```

### Test 2 — Empty Input

```text
Input:
""

Expected:
Validation error.
No external API request.
```

### Test 3 — Whitespace

```text
Input:
"   Pune   "

Expected:
"Pune"
```

### Test 4 — Invalid City

```text
Input:
UnknownCityXYZ

Expected:
Controlled city-not-found error.
```

### Test 5 — Network Failure

```text
External API:
Connection failure

Expected:
Controlled network error.
```

### Test 6 — Timeout

```text
External API:
Timeout

Expected:
Controlled timeout error.
```

### Test 7 — HTTP 500

```text
External API:
500

Expected:
Controlled external-service error.
```

### Test 8 — Rate Limit

```text
External API:
429

Expected:
Controlled rate-limit error.
```

### Test 9 — Malformed Response

Example:

```json
{}
```

Expected:

```text
InvalidResponseError
```

### Test 10 — Response Transformation

Verify that external API data is correctly transformed into the application's internal weather model.

Mock external API requests.

Tests must be deterministic and should not depend on live weather API availability.

---

# 20. Example End-to-End Flow

## Successful Example

Input:

```text
Pune
```

Flow:

```text
User Input
    ↓
Validation
    ↓
Weather Service
    ↓
API Client
    ↓
Weather API
    ↓
Response Validation
    ↓
Internal Weather Model
    ↓
UI
```

Example output:

```text
Pune

28°C
Cloudy

Humidity: 72%
Wind: 12 km/h
```

---

# 21. Failure Example

Input:

```text
UnknownCityXYZ
```

Flow:

```text
User Input
    ↓
Validation
    ↓
Weather Service
    ↓
Weather API
    ↓
404
    ↓
CityNotFoundError
    ↓
User-Friendly Error
```

Output:

```text
We couldn't find weather information for that city.
Please check the spelling and try again.
```

---

# 22. Novel Features

Only implement novel features after all mandatory requirements are stable.

Choose a small number of useful features.

Preferred options:

## Recent Searches

Example:

```text
Recent Searches

Pune
Mumbai
Delhi
Bangalore
```

Persist only non-sensitive information.

## Favorite Cities

Example:

```text
★ Pune
★ Mumbai
☆ Delhi
```

## Retry

```text
Unable to fetch weather.

[Retry]
```

## Last Updated

```text
Updated 2 minutes ago
```

## Temperature Unit Toggle

```text
°C | °F
```

Only implement if compatible with the selected API and existing architecture.

## Accessibility

Support:

* keyboard navigation
* semantic labels
* accessible loading states
* accessible error messages
* visible focus
* appropriate ARIA attributes

## Responsive Design

Ensure usability on:

* desktop
* tablet
* mobile

Do not implement all possible features automatically.

Select enhancements that demonstrate engineering judgment.

---

# 23. Performance

Avoid:

* duplicate requests
* unnecessary API calls
* request flooding
* unnecessary component rendering
* unbounded client-side storage
* unnecessary dependencies

If autocomplete is implemented:

* debounce requests
* avoid requesting on every keystroke

If caching is implemented:

* keep it bounded
* define an expiration strategy
* do not cache sensitive information

Do not prematurely optimize.

---

# 24. Dependency Requirements

Before adding a dependency:

1. Check whether the existing project already provides the capability.
2. Determine whether the dependency is actually necessary.
3. Prefer mature and maintained libraries.
4. Avoid packages with overlapping functionality.
5. Keep the dependency footprint small.

Do not introduce a large library for a trivial task.

---

# 25. UI/UX Requirements

The UI should be polished but simple.

Ensure:

* clear page hierarchy
* obvious search field
* obvious search action
* useful loading feedback
* useful error feedback
* readable weather information
* responsive layout
* keyboard accessibility
* meaningful empty state
* recovery after errors

Do not prioritize visual decoration over usability.

---

# 26. Documentation Requirements

Create/update `README.md`.

It must contain exactly these major sections:

```text
# Overview
# Features
# Architecture
# Technology Choices
# Setup
# Environment Variables
# Running the Application
# Testing
# API Integration
# Error Handling
# Security
# Novel Features
# Trade-offs
# Future Work
# Known Limitations
```

Include exact commands for:

* installation
* development
* production build
* tests
* linting/type checking where applicable

Do not document functionality that does not actually exist.

---

# 27. Prompt Documentation

This file is the AI development prompt for Task 1.

During implementation, maintain an accurate record of significant AI prompts used for:

1. Repository analysis
2. Architecture
3. Implementation
4. Testing
5. Security review
6. Edge-case review
7. Refactoring
8. Documentation
9. Final code review

Do not fabricate interactions.

If a prompt is materially changed during development, document the final version and why it was changed.

---

# 28. Development Sequence

Follow these steps sequentially.

## Step 1 — Inspect

Understand the repository.

## Step 2 — Plan

Identify architecture and required changes.

## Step 3 — MVP

Implement:

```text
City → API → Weather Result
```

## Step 4 — Validation

Add input validation.

## Step 5 — Loading

Add loading state.

## Step 6 — Errors

Add all required failure handling.

## Step 7 — Response Validation

Validate external API data.

## Step 8 — Tests

Implement automated tests.

## Step 9 — Security Review

Review secrets, input, external data, logging, and dependencies.

## Step 10 — Architecture Review

Refactor only where justified.

## Step 11 — UX

Improve responsive behavior and accessibility.

## Step 12 — Novel Features

Add only high-value enhancements.

## Step 13 — Documentation

Complete README and prompt documentation.

## Step 14 — Final Validation

Run all available checks.

---

# 29. Final Security Checklist

Before completion, verify:

* [ ] No API key is hardcoded.
* [ ] No secret is present in frontend source unnecessarily.
* [ ] `.env` is ignored.
* [ ] `.env.example` contains placeholders only.
* [ ] User input is validated.
* [ ] External API responses are validated.
* [ ] Error messages do not leak internals.
* [ ] Logs do not contain secrets.
* [ ] No unsafe command execution exists.
* [ ] No unsafe HTML rendering exists.
* [ ] Dependencies are justified.
* [ ] No obvious security vulnerability was introduced.

---

# 30. Final Functional Checklist

Verify:

* [ ] Application starts successfully.
* [ ] User can search for a city.
* [ ] Weather data is displayed.
* [ ] Temperature is displayed.
* [ ] Humidity is displayed.
* [ ] Wind speed is displayed.
* [ ] Weather condition is displayed.
* [ ] Loading state works.
* [ ] Empty input is handled.
* [ ] Invalid city is handled.
* [ ] Network failure is handled.
* [ ] API failure is handled.
* [ ] Timeout is handled.
* [ ] Rate limiting is handled where applicable.
* [ ] Malformed API responses are handled.
* [ ] User can recover from errors.
* [ ] UI works on mobile and desktop.

---

# 31. Final Quality Checklist

Verify:

* [ ] Architecture is understandable.
* [ ] Responsibilities are separated.
* [ ] OOP is used appropriately.
* [ ] No unnecessary abstractions exist.
* [ ] No giant functions/components exist.
* [ ] No duplicated business logic exists.
* [ ] Automated tests exist.
* [ ] Important edge cases are covered.
* [ ] Build succeeds.
* [ ] Tests pass.
* [ ] Lint/type checking passes where configured.
* [ ] No debug code remains.
* [ ] README is accurate.
* [ ] Prompt documentation is accurate.
* [ ] Novel features do not compromise MVP.

---

# 32. Definition of Done

Task 1 is complete only when:

1. The required weather functionality works end-to-end.
2. Required weather information is displayed.
3. Loading and error states work.
4. Invalid input is handled.
5. External failures are handled gracefully.
6. External responses are validated.
7. Credentials are securely managed.
8. Automated tests cover important behavior and edge cases.
9. Architecture is clean and explainable.
10. UI is responsive and accessible.
11. Documentation is complete.
12. Any novel features are stable and useful.
13. The application can be demonstrated and defended during a live technical evaluation.

---

# 33. Final Agent Response Contract

After implementation, return a concise final report containing **exactly these six sections**:

```text
## Implementation Summary
## Architecture
## Security
## Tests Executed
## Novel Features
## Known Limitations
```

Maximum final response length: **600 words**.

Use concise, technical, factual language.

Do not include irrelevant commentary.

Do not claim tests, builds, security checks, or features were completed unless they were actually verified.

If something could not be verified, explicitly state:

```text
Not verified
```

instead of assuming success.
