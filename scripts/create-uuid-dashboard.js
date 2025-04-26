// Simple script to create a default dashboard with UUID
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete the existing default dashboard if it exists
    try {
      console.log('Checking for old default dashboard...');
      const oldDashboard = await prisma.dashboard.findUnique({
        where: { id: 'default-dashboard-1' }
      });
      
      if (oldDashboard) {
        console.log('Found old default dashboard, deleting...');
        // Delete related records first
        await prisma.menuUsage.deleteMany({
          where: { dashboardId: 'default-dashboard-1' }
        });
        
        await prisma.workspace.deleteMany({
          where: { dashboardId: 'default-dashboard-1' }
        });
        
        await prisma.dashboard.delete({
          // where: { id: 'default-dashboard-1' } // removed legacy default-dashboard-1 cleanup

        });
        
        console.log('Deleted old default dashboard');
      }
    } catch (e) {
      console.log('No old dashboard to delete or error occurred:', e.message);
    }

    // Create new dashboard with UUID
    const newDashboardId = randomUUID();
    console.log('Generated new dashboard UUID:', newDashboardId);
    
    // Create a unique name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dashboardName = `Default Dashboard (${timestamp})`;
    
    const defaultDashboard = await prisma.dashboard.create({
      data: {
        id: newDashboardId,
        name: dashboardName,
        description: 'Default dashboard for all users',
        createdById: '0ce7617f-d950-4048-8c96-c73168ad9e2b' // Using your user ID
      }
    });
    console.log('Created new default dashboard:', defaultDashboard.id);

    // Create workspace
    const workspaceId = randomUUID();
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
    const menuItemId = randomUUID();
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

    // Create dashboard assignments for all users
    try {
      const users = await prisma.user.findMany({
        select: { id: true }
      });
      console.log(`Found ${users.length} users to assign to the dashboard`);
      
      let assignmentCount = 0;
      for (const user of users) {
        try {
          // Check if assignment already exists
          const existingAssignment = await prisma.dashboardAssignment.findFirst({
            where: {
              userId: user.id,
              dashboardId: newDashboardId
            }
          });

          if (!existingAssignment) {
            await prisma.dashboardAssignment.create({
              data: {
                userId: user.id,
                dashboardId: newDashboardId
              }
            });
            assignmentCount++;
          }
        } catch (e) {
          console.log(`Error with dashboard assignment for user ${user.id}:`, e.message);
        }
      }
      console.log(`Created ${assignmentCount} dashboard assignments`);
    } catch (e) {
      console.log('Error creating dashboard assignments:', e.message);
    }

    // Output information for future reference
    console.log('\nDefault Dashboard Information:');
    console.log(`Dashboard ID: ${newDashboardId}`);
    console.log(`Workspace ID: ${workspaceId}`);
    console.log(`Menu Item ID: ${menuItemId}`);
    
    // Save the information to a file
    fs.writeFileSync('default-dashboard-info.txt', 
      `Default Dashboard ID: ${newDashboardId}
Workspace ID: ${workspaceId}
Menu Item ID: ${menuItemId}

Add this to your .env file:
DEFAULT_DASHBOARD_ID=${newDashboardId}

Add this code to your user creation logic:

// When creating a new user:
await prisma.dashboardAssignment.create({
  data: {
    userId: newUserId,
    dashboardId: "${newDashboardId}"
  }
});`);
    
    console.log('\nSaved dashboard information to default-dashboard-info.txt');
    console.log('\nTo use this dashboard as the default, update your code to redirect to:');
    console.log(`/dashboard/${newDashboardId}`);

  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
