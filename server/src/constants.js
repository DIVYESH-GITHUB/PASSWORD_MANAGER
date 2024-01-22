const DB_NAME = "PASSWORD_MANAGER";

const PASSWORD_CATEGORIES = [
  "Work",
  "Personal",
  "Finance",
  "Social Media",
  "Entertainment",
  "Email",
  "Utilities",
  "Healthcare",
  "Education",
  "Shopping",
  "Travel",
  "Cloud Services",
  "Government",
  "Gaming",
  "Family Accounts",
  "Others",
];

const algorithm = "aes-256-cbc";

const ivLength = 16;

export { DB_NAME, PASSWORD_CATEGORIES, algorithm, ivLength };
