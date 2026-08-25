# Task 2 — CSV Parser Bug

## 1. Role

Act as a **Senior Software Engineer, Software Architect, OOP Engineer, Security Engineer, QA Engineer, and Code Reviewer**.

Your objective is to fix and improve the existing CSV parser so that it is:

* Functionally correct
* Robust against malformed input
* Secure
* Testable
* Maintainable
* Architecturally clean
* Easy to understand and modify
* Properly documented

Treat this as production-quality engineering rather than a quick bug fix.

The solution must prioritize:

1. Functional correctness
2. Correct parsing behavior
3. Architecture and separation of concerns
4. Error handling
5. Edge cases
6. Automated testing
7. Security
8. Usability
9. Documentation
10. Useful enhancements

Never sacrifice parser correctness for additional features.

---

# 2. Task Definition

The task is:

**CSV Parser Bug**

The existing parser fails when CSV records contain missing columns or malformed data.

Fix the parser so that it:

* Reads structured CSV data safely.
* Handles incomplete records.
* Handles extra fields.
* Handles blank cells.
* Handles malformed records.
* Handles inconsistent field counts.
* Handles quote/escape problems.
* Does not crash because of one malformed row.
* Returns useful errors.
* Identifies the affected row.
* Preserves valid records.
* Makes the failure easy to reproduce and test.

The challenge specifically states that the repository should allow users to clone the project, run sample input, reproduce the failure, and improve the parsing logic.

---

# 3. Target Audience

The implementation will be reviewed by:

* Software engineers
* Technical interviewers
* Engineering managers
* Developers evaluating code quality

Assume reviewers have intermediate-to-advanced engineering knowledge.

The implementation must therefore be:

* technically sound
* explainable
* maintainable
* easy to debug
* easy to extend

If a frontend exists or is added, its users should not need technical knowledge.

---

# 4. Scope

## Mandatory

Implement:

* CSV parsing
* Header handling
* Record parsing
* Field-count validation
* Missing-column detection
* Extra-column detection
* Blank-cell handling
* Quote/escape validation
* Structured errors
* Row-level error reporting
* Partial-success behavior
* Automated tests
* Sample input
* Reproducible failure case
* Documentation
* Security review

## Do Not Add Unnecessary Complexity

Do not introduce:

* authentication
* user accounts
* databases
* cloud infrastructure
* unrelated APIs
* microservices
* unnecessary third-party dependencies

unless already required by the repository.

---

# 5. Repository Inspection

Before changing anything:

1. Inspect the entire repository.
2. Locate the parser.
3. Identify the current parsing algorithm.
4. Identify existing models/types.
5. Identify existing validation.
6. Identify existing error handling.
7. Identify existing tests.
8. Identify sample input.
9. Identify how the parser is executed.
10. Identify README/documentation.
11. Determine the current failure mechanism.

Reproduce the existing bug before implementing the fix whenever practical.

Do not blindly rewrite the parser.

First understand:

```text id="9m3kz7"
Current Input
      ↓
Current Parser
      ↓
Current Failure
      ↓
Root Cause
      ↓
Corrected Design
```

---

# 6. Root Cause Analysis

Before fixing the bug, determine the actual root cause.

Explicitly investigate whether the problem is caused by:

* naïve comma splitting
* incorrect field counting
* missing-field assumptions
* incorrect quote handling
* malformed escape handling
* improper row boundaries
* unsafe indexing
* missing validation
* incorrect error propagation
* assumptions about every row being valid

Do not fix symptoms without understanding the underlying problem.

The final implementation should address the root cause rather than merely preventing one specific crash.

---

# 7. Required Architecture

Use clear separation of responsibilities.

Prefer an architecture conceptually similar to:

```text id="2pwzgu"
CSV Input
    ↓
CSV Reader / Tokenizer
    ↓
Record Parser
    ↓
Record Validator
    ↓
Normalized Record
    ↓
Parse Result
```

Where appropriate, separate:

```text id="g3n0p4"
CSVParser
CSVReader
RecordValidator
ParseResult
ParseError
```

The exact names should follow the existing project's conventions.

---

# 8. Parsing vs Validation

Do not unnecessarily mix parsing and business validation.

Conceptually:

```text id="t5k2d7"
Raw CSV
   ↓
Parsing
   ↓
Structured Fields
   ↓
Structural Validation
   ↓
Record
```

For example:

### Parsing problem

```text
Unclosed quote
```

This is a CSV parsing error.

### Structural problem

```text
Expected 3 fields but received 2
```

This is a record structure/validation error.

Keep these concepts distinguishable where practical.

---

# 9. OOP Requirements

Use OOP where it provides real value.

Possible abstractions:

```text id="e3j7px"
CSVParser
RecordValidator
ParseResult
ParseError
```

Potential error categories:

```text id="kjl7k4"
MissingColumnError
ExtraColumnError
MalformedRecordError
InvalidQuoteError
InvalidFieldCountError
```

Do not create a separate class for every tiny operation.

Do not use inheritance merely to demonstrate OOP.

Follow:

* Single Responsibility Principle
* Encapsulation
* Dependency Inversion where useful
* Open/Closed Principle where useful

Prefer composition over inheritance.

---

# 10. Security Requirements

Treat CSV input as **untrusted input**.

Never assume that CSV content is safe.

---

# 11. Input Validation

Validate:

* input existence
* input type
* empty input
* malformed rows
* unexpected field counts
* malformed quotes
* invalid escaping
* excessive input size where appropriate

Do not allow malformed input to crash the application.

---

# 12. CSV Injection / Spreadsheet Security

Be aware of spreadsheet formula injection.

CSV fields beginning with values such as:

```text
=
+
-
@
```

can potentially be interpreted as formulas by spreadsheet software.

If parsed records are subsequently exported to spreadsheet-compatible formats, do not blindly treat user-controlled fields as formulas.

If sanitization is implemented:

* document it
* avoid corrupting normal CSV data unnecessarily
* make the behavior explicit

Do not silently alter user data without justification.

---

# 13. File Handling Security

If the application accepts uploaded CSV files:

Validate:

* file type where applicable
* file size
* file name handling
* encoding
* content structure

Do not trust the filename extension alone.

Avoid:

* arbitrary filesystem paths
* path traversal
* unsafe temporary file handling
* executing uploaded content

Never construct shell commands using raw filenames or CSV content.

---

# 14. Resource Exhaustion

Consider malicious or extremely large CSV input.

Avoid:

* uncontrolled memory allocation
* infinite loops
* excessive recursion
* unbounded error accumulation
* unnecessary duplication of entire datasets

If appropriate, introduce reasonable limits such as:

* maximum file size
* maximum row length
* maximum number of errors retained

If limits are introduced, document them.

Do not introduce arbitrary limits without a reason.

---

# 15. Error Information Security

Errors should be useful without leaking internal details.

Good:

```text id="c4d6l7"
Row 4:
Expected 3 fields but received 2.
Missing field: age.
```

Avoid exposing:

```text id="z8v5hn"
Internal filesystem paths
Stack traces
Server internals
Credentials
Environment variables
```

---

# 16. Logging

Use logging appropriately.

Logs may contain:

* row number
* error type
* parser operation
* safe diagnostic information

Logs must not contain:

* credentials
* secrets
* access tokens
* passwords
* unnecessary sensitive data

Do not leave debug logging in the final implementation.

---

# 17. Required CSV Behavior

Assume the header is:

```csv id="x5v7dm"
name,email,age
```

---

# 18. Valid Record

Input:

```csv id="4f0qg8"
name,email,age
Eshan,eshan@example.com,22
```

Expected:

```text id="1by8al"
Valid record:

name  = Eshan
email = eshan@example.com
age   = 22
```

No error should be produced.

---

# 19. Missing Column

Input:

```csv id="qgrr4p"
name,email,age
Eshan,eshan@example.com
```

Expected:

```text id="8u2x5g"
Row 2:
Expected 3 fields but received 2.
Missing field: age.
```

Requirements:

* Do not crash.
* Do not shift fields.
* Do not silently invent values.
* Report the row.
* Identify the missing field where possible.
* Continue processing subsequent rows.

---

# 20. Extra Column

Input:

```csv id="w5e8p1"
name,email,age
Eshan,eshan@example.com,22,India
```

Expected:

```text id="5r3q0j"
Row 2:
Expected 3 fields but received 4.
```

Do not silently discard the extra field unless the application's existing specification explicitly requires that behavior.

If the implementation chooses to preserve the extra data, document the behavior.

---

# 21. Blank Cell

Input:

```csv id="4ghm6p"
name,email,age
Eshan,,22
```

Determine whether blank values are allowed based on the existing application's requirements.

If blank values are allowed:

```text id="7x4v1m"
Valid record
email = ""
```

If the field is required:

```text id="9qz7cs"
Row 2:
Missing required value: email.
```

Do not invent validation requirements without documenting the decision.

---

# 22. Empty Row

Input:

```csv id="2bqv7w"
name,email,age

Eshan,eshan@example.com,22
```

Handle empty rows deliberately.

Choose behavior based on the existing application's expected semantics.

Possible behavior:

```text id="j4m8cs"
Ignore empty row
```

or:

```text id="e1r4nz"
Return an explicit empty-row error
```

Document the decision.

Do not accidentally treat an empty row as a valid record containing arbitrary empty fields.

---

# 23. Malformed Quote

Input:

```csv id="3qg5v1"
name,email,age
Eshan,"eshan@example.com,22
```

Expected:

* Parser must not crash.
* Record must be reported as malformed.
* Row number must be included.
* Error must explain the problem.

Example:

```text id="e8k5y2"
Row 2:
Malformed CSV record.
Reason: unclosed quoted field.
```

---

# 24. Quoted Comma

This is a valid CSV record:

```csv id="8a5d2j"
name,address,age
Eshan,"Pune, Maharashtra",22
```

Expected fields:

```text id="e6u9p0"
name    = Eshan
address = Pune, Maharashtra
age     = 22
```

Do not naïvely parse this as four columns.

Avoid an implementation equivalent to:

```text id="2j5q9r"
line.split(",")
```

when quoted CSV fields are supported.

Use the appropriate CSV parsing strategy/library for the project's language.

---

# 25. Quoted Quotes / Escaping

If standard CSV escaping is supported, test values such as:

```csv id="j2v4r8"
name,description
Eshan,"He said ""hello"""
```

Expected:

```text id="3x8c5p"
description = He said "hello"
```

Follow the CSV semantics supported by the chosen parser/library.

---

# 26. Multiline Quoted Field

If the parser supports multiline quoted fields, test:

```csv id="4s7k1n"
name,description
Eshan,"Developer
from Pune"
```

Do not incorrectly treat the newline inside the quoted field as the end of the record.

If multiline fields are intentionally unsupported:

* document the limitation
* return a clear error
* never silently corrupt the record

---

# 27. Multiple Errors

Input:

```csv id="x7m2p4"
name,email,age
Eshan,eshan@example.com,22
Rahul,rahul@example.com
Amit,amit@example.com,24,India
Neha,"neha@example.com,25
Priya,priya@example.com,26
```

Expected conceptual result:

```json id="4w6x3n"
{
  "records": [
    {
      "name": "Eshan",
      "email": "eshan@example.com",
      "age": "22"
    },
    {
      "name": "Priya",
      "email": "priya@example.com",
      "age": "26"
    }
  ],
  "errors": [
    {
      "row": 3,
      "type": "MISSING_COLUMNS"
    },
    {
      "row": 4,
      "type": "EXTRA_COLUMNS"
    },
    {
      "row": 5,
      "type": "MALFORMED_RECORD"
    }
  ]
}
```

The exact structure may differ according to the existing project.

The critical requirement is:

> **One malformed row must not prevent valid subsequent rows from being processed whenever recovery is safely possible.**

---

# 28. Structured Result

Prefer a structured parser result.

Conceptually:

```json id="v8y2tp"
{
  "records": [],
  "errors": []
}
```

A successful parse may return:

```json id="4d7nq8"
{
  "records": [
    {
      "name": "Eshan",
      "email": "eshan@example.com",
      "age": "22"
    }
  ],
  "errors": []
}
```

A partial-success parse may return:

```json id="9t6r2m"
{
  "records": [
    {
      "name": "Eshan",
      "email": "eshan@example.com",
      "age": "22"
    }
  ],
  "errors": [
    {
      "row": 3,
      "type": "MISSING_COLUMNS",
      "message": "Expected 3 fields but received 2"
    }
  ]
}
```

Errors should contain enough information for a developer or user to understand what happened.

Recommended fields:

```text id="n8v3kc"
row
type
message
field
receivedFieldCount
expectedFieldCount
```

Only include fields that are actually useful.

---

# 29. Partial Success

The parser should prefer partial success when safe.

For example:

```text id="9z7d2x"
Row 1 → valid
Row 2 → invalid
Row 3 → valid
Row 4 → invalid
Row 5 → valid
```

Expected conceptual result:

```text id="k6m2w9"
Valid records:
1, 3, 5

Errors:
2, 4
```

Do not stop the entire parsing operation after the first recoverable row-level error.

However, if the entire file is fundamentally unreadable, return an appropriate fatal error rather than producing misleading records.

---

# 30. Fatal vs Recoverable Errors

Distinguish between:

### Recoverable

Examples:

* missing columns
* extra columns
* malformed individual row
* blank value

These should generally allow subsequent rows to be processed.

### Potentially fatal

Examples:

* unreadable file
* unsupported encoding
* impossible parser state
* invalid configuration
* unavailable required input stream

Do not pretend to parse data when the input itself cannot safely be processed.

---

# 31. Frontend / User Interface

Do **not** assume that a frontend is mandatory unless the existing repository or implementation architecture calls for one.

The task specification requires usability around:

* reproducing the failure
* seeing successfully parsed rows
* seeing failed rows
* understanding row-specific errors.

If the repository already contains a frontend, integrate the parser into it appropriately.

If a frontend is not present, a clean CLI/sample-input interface is acceptable for the core task.

If you choose to add a frontend as an enhancement, keep it lightweight.

A useful optional interface could provide:

```text id="v5n8q2"
CSV Upload / Sample Input

        ↓

Parse

        ↓

Summary
Valid rows: 8
Failed rows: 2

        ↓

Valid Records
[Table]

        ↓

Parsing Errors
Row | Type | Message
```

Do not spend the majority of the challenge time building UI when the parser itself is incomplete.

---

# 32. Sample Input

Provide reproducible sample data containing:

* valid row
* missing column
* extra column
* blank cell
* malformed quote
* quoted comma

Example:

```csv id="4y7m1z"
name,email,age
Eshan,eshan@example.com,22
Rahul,rahul@example.com
Amit,amit@example.com,24,India
Neha,,25
Priya,"priya@example.com",26
Karan,"karan@example.com,27
```

Ensure the sample actually reproduces the relevant parser behavior.

---

# 33. Testing Requirements

Create automated tests for all important behaviors.

Minimum test categories:

### Basic parsing

* valid header
* valid row
* multiple valid rows

### Field counts

* missing column
* extra column
* exact field count

### Values

* blank cell
* whitespace
* empty row

### CSV syntax

* quoted comma
* escaped quote
* malformed quote
* multiline quoted field if supported

### Error handling

* correct row number
* correct error type
* useful error message
* multiple errors
* partial success

### Recovery

Verify:

```text id="z1r8x7"
Invalid row
    ↓
Error recorded
    ↓
Next valid row
    ↓
Successfully parsed
```

### Large input

If practical, test a larger dataset to identify obvious performance problems.

---

# 34. Test Example

Given:

```csv id="t3r9w1"
name,email,age
Eshan,eshan@example.com,22
Rahul,rahul@example.com
Priya,priya@example.com,26
```

Expected:

```text id="0q2k6s"
records.length = 2
errors.length = 1
errors[0].row = 3
errors[0].type = MISSING_COLUMNS
```

The exact assertions should follow the project's test framework.

---

# 35. Security Testing

Verify that:

* [ ] CSV content cannot execute code.
* [ ] CSV content cannot trigger shell commands.
* [ ] Filenames cannot cause path traversal.
* [ ] Uploaded files cannot be written outside intended directories.
* [ ] Large files cannot cause uncontrolled resource consumption.
* [ ] Secrets are not included in CSV error messages or logs.
* [ ] Spreadsheet formula injection is considered where CSV output is later consumed by spreadsheet software.
* [ ] Errors do not expose internal paths or stack traces.
* [ ] Dependencies are justified and maintained.

---

# 36. Performance Requirements

Avoid:

* repeated parsing of the same input
* unnecessary copies of large datasets
* quadratic algorithms where avoidable
* unbounded memory growth
* recursive parsing for arbitrarily large input
* storing unlimited errors

Prefer streaming/incremental processing if the existing architecture and language support it appropriately.

Do not over-engineer for massive datasets unless the repository requires it.

---

# 37. Dependency Requirements

Before adding a CSV library:

1. Check whether the repository already has one.
2. Determine whether the existing implementation should be fixed or replaced.
3. Prefer a mature, maintained library when appropriate.
4. Do not add a dependency simply to solve a trivial problem.
5. Document why the dependency is necessary.

If a standard library provides robust CSV parsing, prefer it where appropriate.

---

# 38. Documentation Requirements

Update/create `README.md`.

Include exactly these major sections:

```text id="9c4j2x"
# Overview
# Problem
# Root Cause
# Solution
# Architecture
# Parsing Strategy
# Error Handling
# Security
# Sample Input
# Sample Output
# Setup
# Running
# Testing
# Trade-offs
# Future Work
# Known Limitations
```

Explain:

* original bug
* root cause
* fix
* parser architecture
* error model
* malformed-input behavior
* security decisions
* testing strategy

Include reproducible commands.

---

# 39. Prompt Documentation

This file documents the AI-assisted development process.

Record significant prompts actually used for:

1. Repository analysis
2. Root-cause analysis
3. Architecture design
4. Implementation
5. Edge-case analysis
6. Testing
7. Security review
8. Refactoring
9. Documentation
10. Final code review

Do not fabricate prompts or results.

If implementation required prompt iteration, document the important iterations.

---

# 40. Development Sequence

Follow this exact sequence.

## Step 1 — Inspect

Understand the existing repository.

## Step 2 — Reproduce

Run the existing parser against the provided/sample malformed data.

## Step 3 — Root Cause

Identify the actual failure mechanism.

## Step 4 — Design

Define the corrected parsing and error-handling architecture.

## Step 5 — MVP Fix

Fix the core parser.

## Step 6 — Missing Columns

Handle incomplete records.

## Step 7 — Extra Columns

Handle excessive fields.

## Step 8 — Malformed CSV

Handle quote/escape problems.

## Step 9 — Partial Success

Ensure valid records continue to parse.

## Step 10 — Structured Errors

Return useful row-level errors.

## Step 11 — Tests

Add comprehensive automated tests.

## Step 12 — Security Review

Review input, files, resource usage, logging, and CSV injection risks.

## Step 13 — Architecture Review

Refactor only where justified.

## Step 14 — Usability

Improve CLI/sample output or existing frontend if appropriate.

## Step 15 — Documentation

Complete README and prompt documentation.

## Step 16 — Final Validation

Run all available checks.

---

# 41. Final Functional Checklist

Before completion:

* [ ] Existing parser bug reproduced or understood.
* [ ] Root cause identified.
* [ ] Valid CSV parses correctly.
* [ ] Missing columns handled.
* [ ] Extra columns handled.
* [ ] Blank cells handled according to documented rules.
* [ ] Empty rows handled.
* [ ] Malformed quotes handled.
* [ ] Escaped quotes handled where supported.
* [ ] Quoted commas handled.
* [ ] Multiline fields handled or explicitly documented as unsupported.
* [ ] Row numbers are reported.
* [ ] Errors contain useful messages.
* [ ] Valid rows continue processing after malformed rows.
* [ ] Multiple errors can be reported.
* [ ] Fatal errors are distinguished from recoverable errors.
* [ ] Sample input reproduces important cases.
* [ ] Tests pass.

---

# 42. Final Security Checklist

Verify:

* [ ] CSV content is treated as untrusted.
* [ ] No CSV content is executed.
* [ ] No shell commands use raw CSV input.
* [ ] No path traversal is possible through filenames.
* [ ] File size is appropriately controlled where applicable.
* [ ] Resource consumption is considered.
* [ ] Spreadsheet formula injection is considered.
* [ ] Secrets cannot appear in parser errors.
* [ ] Logs do not contain secrets.
* [ ] Internal paths are not exposed.
* [ ] Dependencies are justified.
* [ ] No obvious critical security issue remains.

---

# 43. Final Architecture Checklist

Verify:

* [ ] Parsing and validation responsibilities are clear.
* [ ] Error representation is structured.
* [ ] Business logic is not mixed unnecessarily with I/O.
* [ ] OOP abstractions have practical value.
* [ ] No unnecessary design patterns exist.
* [ ] No giant classes/functions exist.
* [ ] No duplicated parser logic exists.
* [ ] Code is easy to test.
* [ ] Code is easy to modify.

---

# 44. Definition of Done

Task 2 is complete only when:

1. The original parser problem is fixed.
2. Valid records parse correctly.
3. Malformed records do not crash the application.
4. Missing columns are identified.
5. Extra columns are identified.
6. Blank cells are handled deliberately.
7. Quote/escape problems are handled.
8. Row-specific errors are returned.
9. Valid records continue processing after recoverable failures.
10. Errors are structured and useful.
11. Automated tests cover normal and malformed input.
12. Security concerns are addressed.
13. Sample input can reproduce important scenarios.
14. Documentation explains the root cause and solution.
15. The implementation is easy to defend and modify during a live technical evaluation.

---

# 45. Final Agent Response Contract

After implementation, return **exactly these six sections**:

```text id="4u7s1x"
## Implementation Summary
## Root Cause
## Architecture
## Security
## Tests Executed
## Known Limitations
```

Maximum final response length: **600 words**.

Use concise, technical, factual language.

Do not include irrelevant commentary.

Do not claim that tests, builds, security checks, or features passed unless they were actually executed.

If something was not verified, explicitly state:

```text id="t8y3mc"
Not verified
```

instead of assuming success.
