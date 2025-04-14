/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Dashboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,createdById]` on the table `Dashboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,dashboardId]` on the table `DashboardAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,organizationId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menuId]` on the table `MenuDataSource` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,parentId]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menuId,roleId]` on the table `MenuPermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menuId,userId]` on the table `MenuPermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menuId,workspaceId]` on the table `MenuUsage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menuId,dashboardId,workspaceId]` on the table `MenuUsage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `OrgRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,createdById]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `OrganizationMembership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,dashboardId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,workspaceId]` on the table `WorkspaceAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_name_organizationId_key" ON "Dashboard"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_name_createdById_key" ON "Dashboard"("name", "createdById");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardAssignment_userId_dashboardId_key" ON "DashboardAssignment"("userId", "dashboardId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_organizationId_key" ON "Invitation"("email", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuDataSource_menuId_key" ON "MenuDataSource"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_title_parentId_key" ON "MenuItem"("title", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuPermission_menuId_roleId_key" ON "MenuPermission"("menuId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuPermission_menuId_userId_key" ON "MenuPermission"("menuId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuUsage_menuId_workspaceId_key" ON "MenuUsage"("menuId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuUsage_menuId_dashboardId_workspaceId_key" ON "MenuUsage"("menuId", "dashboardId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgRole_name_organizationId_key" ON "OrgRole"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_createdById_key" ON "Organization"("name", "createdById");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_userId_organizationId_key" ON "OrganizationMembership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_dashboardId_key" ON "Workspace"("name", "dashboardId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceAssignment_userId_workspaceId_key" ON "WorkspaceAssignment"("userId", "workspaceId");
