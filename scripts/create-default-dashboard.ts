import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete the existing default dashboard if it exists
    try {
      await prisma.menuUsage.deleteMany({
        where: { dashboardId: 'default-dashboard-1' }
      });
      await prisma.workspace.deleteMany({
        where: { dashboardId: 'default-dashboard-1' }
      });
      await prisma.dashboard.deleteMany({
        // where: { id: 'default-dashboard-1' } // removed legacy default-dashboard-1 cleanup

      });
      console.log('Deleted old default dashboard');
    } catch (e: any) {
      console.log('No old dashboard to delete or error occurred');
    }

    // Create new dashboard with UUID
    const newDashboardId = uuidv4();
    console.log('Generated new dashboard UUID:', newDashboardId);
    
    const defaultDashboard = await prisma.dashboard.create({
      data: {
        id: newDashboardId,
        name: 'Default Dashboard',
        description: 'Default dashboard for all users',
        createdById: '0ce7617f-d950-4048-8c96-c73168ad9e2b' // Using your user ID
      }
    });
    console.log('Created new default dashboard:', defaultDashboard.id);

    // Create workspace
    const workspaceId = uuidv4();
    const defaultWorkspace = await prisma.workspace.create({
      data: {
        id: workspaceId,
        name: 'General',
        description: 'General workspace for the default dashboard',
        dashboardId: newDashboardId
      }
    });
    console.log('Created default workspace:', defaultWorkspace.id);

    // Create menu item
    const menuItemId = uuidv4();
    const overviewMenuItem = await prisma.menuItem.create({
      data: {
        id: menuItemId,
        title: 'Overview',
        type: 'slice',
        icon: 'LayoutDashboard',
        target: 'overview',
        globalContext: false
      }
    });
    console.log('Created overview menu item:', overviewMenuItem.id);

    // Create menu usage for dashboard
    await prisma.menuUsage.create({
      data: {
        menuId: menuItemId,
        dashboardId: newDashboardId,
        workspaceId: null,
        orderIndex: 0
      }
    });
    console.log('Created menu usage for dashboard menu item');

    // Create menu usage for workspace
    await prisma.menuUsage.create({
      data: {
        menuId: menuItemId,
        dashboardId: newDashboardId,
        workspaceId: workspaceId,
        orderIndex: 0
      }
    });
    console.log('Created menu usage for workspace menu item');

    // Update all users to have this as their default dashboard
    try {
      const users = await prisma.user.findMany({
        where: {
          
        }
      });
      
      let updatedCount = 0;
      for (const user of users) {
        await prisma.user.update({
          where: { id: user.id },
          data: {  }
        });
        updatedCount++;
      }
      
      console.log(`Updated ${updatedCount} users to use the new default dashboard`);
    } catch (e: any) {
      console.log(`Error updating users' default dashboard: ${e.message}`);
    }

    // Create dashboard assignments for all users
    const users = await prisma.user.findMany();
    for (const user of users) {
      try {
        // Check if assignment already exists
        const existingAssignment = await prisma.dashboardAssignment.findUnique({
          where: {
            userId_dashboardId: {
              userId: user.id,
              dashboardId: newDashboardId
            }
          }
        });

        if (!existingAssignment) {
          await prisma.dashboardAssignment.create({
            data: {
              userId: user.id,
              dashboardId: newDashboardId
            }
          });
          console.log(`Created dashboard assignment for user ${user.id}`);
        } else {
          console.log(`Dashboard assignment already exists for user ${user.id}`);
        }
      } catch (e: any) {
        console.log(`Error with dashboard assignment for user ${user.id}: ${e.message}`);
      }
    }

    // Output information for future reference
    console.log('\nDefault Dashboard Information:');
    console.log(`Dashboard ID: ${newDashboardId}`);
    console.log(`Workspace ID: ${workspaceId}`);
    console.log(`Menu Item ID: ${menuItemId}`);
    
    console.log('\nTo assign this dashboard to new users, add this code to your user creation logic:');
    console.log(`
// const defaultDashboardId = '${newDashboardId}';

// When creating a new user:
const newUser = await prisma.user.create({
  data: {
    // other user fields...
    
  }
});

// Also create a dashboard assignment:
await prisma.dashboardAssignment.create({
  data: {
    userId: newUser.id,
    dashboardId: newDashboardId
  }
});`);

    // Save the information to a file
    const fs = require('fs');
    fs.writeFileSync('default-dashboard-info.txt', 
      `Default Dashboard ID: ${newDashboardId}
Workspace ID: ${workspaceId}
Menu Item ID: ${menuItemId}

Add this to your .env file:
DEFAULT_DASHBOARD_ID=${newDashboardId}`);
    
    console.log('\nSaved dashboard information to default-dashboard-info.txt');

  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
