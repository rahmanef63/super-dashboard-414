import { PrismaClient, MenuItem } from "@prisma/client"; // Import MenuItem type

const prisma = new PrismaClient();

// The data provided by the user
const dashboardSeedData = [
  // ... (keep existing dashboardSeedData array) ...
  {
    "dashboard": "Corporate Dashboard",
    "menus": [
      "Overview", // Already exists from previous seed, findOrCreate will handle it
      "Analytics",
      "Reporting",
      "User Management",
      "Settings", // Already exists
      "Notifications"
    ],
    "workspaces": [
      {
        "name": "General Operations",
        "workspaceMenus": [
          "Overview",
          "Task Management",
          "Calendar",
          "Quick Reports"
        ]
      },
      {
        "name": "Finance",
        "workspaceMenus": [
          "Financial Reports",
          "Budgeting",
          "Invoice Management",
          "Expense Tracking"
        ]
      },
      {
        "name": "Human Resources",
        "workspaceMenus": [
          "Employee Directory",
          "Recruitment",
          "Payroll",
          "Leave Management"
        ]
      }
    ]
  },
  {
    "dashboard": "Retail Dashboard",
    "menus": [
      "Overview", // Changed from "Dashboard"
      "Sales",
      "Inventory",
      "Orders",
      "Customers",
      "Support"
    ],
    "workspaces": [
      {
        "name": "Online Store",
        "workspaceMenus": [
          "E-commerce Analytics",
          "Product Listings",
          "Order Processing",
          "Customer Reviews"
        ]
      },
      {
        "name": "Physical Stores",
        "workspaceMenus": [
          "Store Performance",
          "Stock Management",
          "Point of Sale",
          "Local Promotions"
        ]
      }
    ]
  },
  {
    "dashboard": "Education Dashboard",
    "menus": [
      "Courses",
      "Students",
      "Faculty",
      "Exams",
      "Progress",
      "Administration"
    ],
    "workspaces": [
      {
        "name": "Undergraduate Programs",
        "workspaceMenus": [
          "Course Enrollment",
          "Class Schedules",
          "Grade Reports",
          "Student Advising"
        ]
      },
      {
        "name": "Postgraduate Programs",
        "workspaceMenus": [
          "Research Management",
          "Thesis Tracking",
          "Seminars",
          "Publication Records"
        ]
      },
      {
        "name": "Online Courses",
        "workspaceMenus": [
          "Virtual Classrooms",
          "Content Management",
          "Interactive Sessions",
          "Progress Tracking"
        ]
      }
    ]
  },
  {
    "dashboard": "Healthcare Dashboard",
    "menus": [
      "Patient Management",
      "Appointments",
      "Billing",
      "Reports",
      "Medical Records",
      "Support"
    ],
    "workspaces": [
      {
        "name": "Inpatient",
        "workspaceMenus": [
          "Ward Management",
          "Patient Monitoring",
          "Diet Plans",
          "Treatment Scheduling"
        ]
      },
      {
        "name": "Outpatient",
        "workspaceMenus": [
          "Consultation Scheduling",
          "Follow-up Tracking",
          "Prescription Management",
          "Patient Feedback"
        ]
      },
      {
        "name": "Emergency",
        "workspaceMenus": [
          "Incident Reporting",
          "Resource Allocation",
          "Critical Alerts",
          "Rapid Response"
        ]
      }
    ]
  },
  {
    "dashboard": "Technology Dashboard",
    "menus": [
      "Projects",
      "Development",
      "QA",
      "Operations",
      "Security",
      "Analytics" // Reused name
    ],
    "workspaces": [
      {
        "name": "Backend",
        "workspaceMenus": [
          "API Management",
          "Database Administration",
          "Server Monitoring",
          "Integration Testing"
        ]
      },
      {
        "name": "Frontend",
        "workspaceMenus": [
          "UI/UX Design",
          "Feature Development",
          "A/B Testing",
          "User Feedback"
        ]
      },
      {
        "name": "DevOps",
        "workspaceMenus": [
          "CI/CD Pipelines",
          "Infrastructure Automation",
          "Deployment Logs",
          "Cloud Management"
        ]
      },
      {
        "name": "QA Team",
        "workspaceMenus": [
          "Bug Tracking",
          "Test Case Management",
          "Automated Testing",
          "Performance Monitoring"
        ]
      }
    ]
  }
];

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create or update Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: { description: "Super administrator with highest level access" },
    create: {
      name: "Super Admin",
      description: "Super administrator with highest level access",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: { description: "Administrator role with full access" },
    create: {
      name: "Admin",
      description: "Administrator role with full access",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: { description: "Standard user role" },
    create: {
      name: "User",
      description: "Standard user role",
    },
  });

  console.log(`Created/updated roles: ${superAdminRole.name}, ${adminRole.name}, ${userRole.name}`);

  // 2. Create or update Users
  const superAdminUser = await prisma.user.upsert({
    where: { email: "rahmanef63@gmail.com" },
    update: { roleId: superAdminRole.id }, // Ensure role is updated if user exists
    create: {
      email: "rahmanef63@gmail.com",
      name: "Rahman", // You can change the name if needed
      roleId: superAdminRole.id,
    },
  });

  // This user will own the seeded dashboards/workspaces
  const adminOwnerUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { roleId: adminRole.id },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      roleId: adminRole.id,
    },
  });

  const standardUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { roleId: userRole.id },
    create: {
      email: "user@example.com",
      name: "Standard User",
      roleId: userRole.id,
    },
  });

  console.log(`Created/updated users: ${superAdminUser.email}, ${adminOwnerUser.email}, ${standardUser.email}`);

  // --- Helper Function to Find or Create Menu Item ---
  async function findOrCreateMenuItem(data: {
    title: string;
    type: string;
    icon?: string;
    target?: string;
    parentId?: string | null;
  }): Promise<MenuItem> {
    const whereClause = {
      title: data.title,
      parentId: data.parentId === undefined ? null : data.parentId,
    };
    let item = await prisma.menuItem.findFirst({ where: whereClause });

    if (!item) {
      console.log(`Creating MenuItem: ${data.title} ${data.parentId ? `(Child of ${data.parentId})` : '(Top Level)'}`);
      item = await prisma.menuItem.create({
        data: { ...data, parentId: data.parentId || null },
      });
    } else {
      console.log(`Found existing MenuItem: ${item.title}`);
      // Optionally update existing item if needed
    }
    return item;
  }

  // --- Seed Initial Admin Dashboard (owned by adminOwnerUser) ---
  console.log("Seeding initial Admin Dashboard...");
  const initialDashboard = await prisma.dashboard.upsert({
    where: { name_createdById: { name: "Admin Dashboard", createdById: adminOwnerUser.id } }, // Use adminOwnerUser
    update: {}, create: { name: "Admin Dashboard", description: "Default dashboard", createdById: adminOwnerUser.id }, // Use adminOwnerUser
  });
  const initialWorkspace = await prisma.workspace.upsert({
    where: { name_dashboardId: { name: "General", dashboardId: initialDashboard.id } },
    update: {}, create: { name: "General", description: "General workspace", dashboardId: initialDashboard.id },
  });
  // Assign the dashboard/workspace owner
  await prisma.dashboardAssignment.upsert({
    where: { userId_dashboardId: { userId: adminOwnerUser.id, dashboardId: initialDashboard.id } }, // Use adminOwnerUser
    update: { roleId: adminRole.id }, create: { userId: adminOwnerUser.id, dashboardId: initialDashboard.id, roleId: adminRole.id },
  });
  await prisma.workspaceAssignment.upsert({
    where: { userId_workspaceId: { userId: adminOwnerUser.id, workspaceId: initialWorkspace.id } }, // Use adminOwnerUser
    update: { roleId: adminRole.id }, create: { userId: adminOwnerUser.id, workspaceId: initialWorkspace.id, roleId: adminRole.id },
  });
  // Assign the Super Admin to the initial dashboard/workspace as well
   await prisma.dashboardAssignment.upsert({
    where: { userId_dashboardId: { userId: superAdminUser.id, dashboardId: initialDashboard.id } },
    update: { roleId: superAdminRole.id }, create: { userId: superAdminUser.id, dashboardId: initialDashboard.id, roleId: superAdminRole.id },
  });
  await prisma.workspaceAssignment.upsert({
    where: { userId_workspaceId: { userId: superAdminUser.id, workspaceId: initialWorkspace.id } },
    update: { roleId: superAdminRole.id }, create: { userId: superAdminUser.id, workspaceId: initialWorkspace.id, roleId: superAdminRole.id },
  });

  const initialMenuItems = [
    { title: "Overview", type: "slice", icon: "LayoutDashboard", target: "overview" },
    { title: "Tasks", type: "slice", icon: "CheckSquare", target: "tasks" },
    { title: "Settings", type: "slice", icon: "Settings", target: "settings" },
  ];
  let initialOrderIndex = 0;
  for (const itemData of initialMenuItems) {
    const menuItem = await findOrCreateMenuItem({ ...itemData, parentId: null });
    await prisma.menuUsage.upsert({
      where: { menuId_workspaceId: { menuId: menuItem.id, workspaceId: initialWorkspace.id } },
      update: { orderIndex: initialOrderIndex },
      create: { menuId: menuItem.id, workspaceId: initialWorkspace.id, dashboardId: initialDashboard.id, orderIndex: initialOrderIndex },
    });
    initialOrderIndex++;
  }
  console.log("Finished seeding initial Admin Dashboard.");

  // --- Seed Additional Dashboards from User Data (owned by adminOwnerUser) ---
  console.log("Seeding additional dashboards from user data");
  for (const dashData of dashboardSeedData) {
    console.log(`
Processing Dashboard: ${dashData.dashboard}`);

    // 3. Create or update the Dashboard (owned by adminOwnerUser)
    const dashboard = await prisma.dashboard.upsert({
      where: { name_createdById: { name: dashData.dashboard, createdById: adminOwnerUser.id } }, // Use adminOwnerUser
      update: {},
      create: {
        name: dashData.dashboard,
        description: `${dashData.dashboard} - Seeded`,
        createdById: adminOwnerUser.id, // Use adminOwnerUser
      },
    });
    console.log(`  Upserted Dashboard ID: ${dashboard.id}`);

    // 4. Assign Admin Owner User to the Dashboard
    await prisma.dashboardAssignment.upsert({
      where: { userId_dashboardId: { userId: adminOwnerUser.id, dashboardId: dashboard.id } }, // Use adminOwnerUser
      update: { roleId: adminRole.id },
      create: { userId: adminOwnerUser.id, dashboardId: dashboard.id, roleId: adminRole.id },
    });
     // Also assign the Super Admin
    await prisma.dashboardAssignment.upsert({
      where: { userId_dashboardId: { userId: superAdminUser.id, dashboardId: dashboard.id } },
      update: { roleId: superAdminRole.id },
      create: { userId: superAdminUser.id, dashboardId: dashboard.id, roleId: superAdminRole.id },
    });
    console.log(`  Assigned admin and super admin users to dashboard.`);

    // 5. Create Dashboard Menu Items and Usage Links
    let dashboardMenuOrder = 0;
    for (const menuTitle of dashData.menus) {
      const menuItem = await findOrCreateMenuItem({
        title: menuTitle,
        type: "slice",
        icon: menuTitle,
        target: menuTitle.toLowerCase().replace(/\s+/g, '-'),
        parentId: null,
      });

      const existingUsage = await prisma.menuUsage.findFirst({
          where: {
              menuId: menuItem.id,
              dashboardId: dashboard.id,
              workspaceId: null
          }
      });

      if (existingUsage) {
          await prisma.menuUsage.update({
              where: { id: existingUsage.id },
              data: { orderIndex: dashboardMenuOrder }
          });
           console.log(`  Updated Dashboard Menu Usage: ${menuTitle}`);
      } else {
          await prisma.menuUsage.create({
              data: {
                  menuId: menuItem.id,
                  dashboardId: dashboard.id,
                  workspaceId: null,
                  orderIndex: dashboardMenuOrder,
              }
          });
          console.log(`  Created Dashboard Menu Usage: ${menuTitle}`);
      }
      dashboardMenuOrder++;
    }

    // 6. Create Workspaces and their Menus
    for (const wsData of dashData.workspaces) {
      console.log(`  Processing Workspace: ${wsData.name}`);
      const workspace = await prisma.workspace.upsert({
        where: { name_dashboardId: { name: wsData.name, dashboardId: dashboard.id } },
        update: {},
        create: {
          name: wsData.name,
          description: `Workspace for ${wsData.name} in ${dashData.dashboard}`,
          dashboardId: dashboard.id,
        },
      });
      console.log(`    Upserted Workspace ID: ${workspace.id}`);

      // Assign Admin Owner User to Workspace
      await prisma.workspaceAssignment.upsert({
        where: { userId_workspaceId: { userId: adminOwnerUser.id, workspaceId: workspace.id } }, // Use adminOwnerUser
        update: { roleId: adminRole.id },
        create: { userId: adminOwnerUser.id, workspaceId: workspace.id, roleId: adminRole.id },
      });
       // Also assign Super Admin
      await prisma.workspaceAssignment.upsert({
        where: { userId_workspaceId: { userId: superAdminUser.id, workspaceId: workspace.id } },
        update: { roleId: superAdminRole.id },
        create: { userId: superAdminUser.id, workspaceId: workspace.id, roleId: superAdminRole.id },
      });
      console.log(`    Assigned admin and super admin users to workspace.`);

      // Create Workspace Menu Items and Usage Links
      let workspaceMenuOrder = 0;
      for (const menuTitle of wsData.workspaceMenus) {
        const menuItem = await findOrCreateMenuItem({
          title: menuTitle,
          type: "slice",
          icon: menuTitle,
          target: menuTitle.toLowerCase().replace(/\s+/g, '-'),
          parentId: null,
        });
        await prisma.menuUsage.upsert({
          where: { menuId_workspaceId: { menuId: menuItem.id, workspaceId: workspace.id } },
          update: { orderIndex: workspaceMenuOrder, dashboardId: dashboard.id },
          create: {
            menuId: menuItem.id,
            workspaceId: workspace.id,
            dashboardId: dashboard.id,
            orderIndex: workspaceMenuOrder,
          },
        });
        console.log(`    Linked Workspace Menu: ${menuTitle}`);
        workspaceMenuOrder++;
      }
    }
  }

  console.log(`
Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
