import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

interface DepartmentInfo {
  [x: string]: any;
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

interface DepartmentDict {
  [department: string]: DepartmentInfo;
}

// Middleware for parsing JSON
app.use(express.json());

// Define a route to fetch users
app.get("/users", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/users");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error });
  }
});

app.get("/summary", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/users");
    const users = response.data.users;

    let department_dict: DepartmentDict = {};

    users.forEach(
      (user: {
        gender: any;
        company: { department: any };
        age: number;
        hair: { color: any };
        firstName: string;
        lastName: string;
        address: { postalCode: string };
      }) => {
        const department = user.company.department;
        if (!department_dict[department]) {
          department_dict[department] = {
            male: 0,
            female: 0,
            ageRange: "", // เตรียมไว้สำหรับเก็บข้อมูลเป็นสตริง
            hair: {},
            addressUser: {},
          };
        }

        // Increment gender count
        if (user.gender.toLowerCase() === 'male') {
            department_dict[department].male += 1;
        } else {
            department_dict[department].female += 1;
        }
        // ใช้ตัวแปรชั่วคราวเพื่อเก็บอายุ
        if (!department_dict[department].tempAges) {
          department_dict[department].tempAges = [];
        }
        department_dict[department].tempAges.push(user.age);

        // Count hair color
        const hair_color = user.hair.color;
        if (!department_dict[department].hair[hair_color]) {
          department_dict[department].hair[hair_color] = 0;
        }
        department_dict[department].hair[hair_color] += 1;

        // Map postal code by full name
        const full_name = user.firstName + " " + user.lastName;
        department_dict[department].addressUser[full_name] =
          user.address.postalCode;
      }
    );

    // แปลงช่วงอายุจากอาร์เรย์เป็นสตริง
    for (const [department, deptInfo] of Object.entries(department_dict)) {
      if (deptInfo.tempAges) {
        const minAge = Math.min(...deptInfo.tempAges);
        const maxAge = Math.max(...deptInfo.tempAges);
        deptInfo.ageRange = `${minAge}-${maxAge}`;
      }
    }

    res.json(department_dict);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
