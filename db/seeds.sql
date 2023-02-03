INSERT INTO department (name)
VALUES 
    ("Design"), 
    ("Web Development"), 
    ("Human Resources"), 
    ("Customer Support");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Designer", 80000.00, 1), 
    ("Developer", 90000.00, 2),
    ("Human Resourcer", 70000, 3),
    ("CSR", 45000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Jimmy","Brungus", 1, NULL),
    ("Jongy","Brogun", 1, 1),
    ("Dander","Ingle", 1, 1),
    ("Dan","Dungus", 2, NULL),
    ("Barbara","Egg", 2, 4),
    ("Diane","Drangle", 2, 4),
    ("Sandy","Grungerson", 3, NULL),
    ("Steve","Drambus", 3, 7),
    ("Steven","Bringle", 3, 7),
    ("Rongle","Bringer", 4, NULL),
    ("Kneel","Armstrang", 4, 10),
    ("Linda","Barangy", 4, 10);