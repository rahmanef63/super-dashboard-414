import {prisma} from "../prisma"
import type { ExternalDomain } from "@prisma/client"

// Get domain by name
export const getDomainByName = async (domainName: string): Promise<ExternalDomain | null> => {
  try {
    console.log(`[external-domain-service] getDomainByName called with domainName: ${domainName}`)
    return await prisma.externalDomain.findUnique({
      where: { domainName },
    })
  } catch (error) {
    console.error(`Error fetching domain with name ${domainName}:`, error)
    return null
  }
}

// Create a new domain
export const createDomain = async (data: {
  domainName: string
  
  organizationId?: string
  description?: string
}): Promise<ExternalDomain | null> => {
  try {
    console.log(`[external-domain-service] createDomain called with data: ${JSON.stringify(data)}`)
    return await prisma.externalDomain.create({
      data,
    })
  } catch (error) {
    console.error("Error creating domain:", error)
    return null
  }
}

// Update a domain
export const updateDomain = async (
  id: string,
  data: {
    domainName?: string
    
    description?: string
  },
): Promise<ExternalDomain | null> => {
  try {
    console.log(`[external-domain-service] updateDomain called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.externalDomain.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating domain with ID ${id}:`, error)
    return null
  }
}

// Delete a domain
export const deleteDomain = async (id: string): Promise<boolean> => {
  try {
    console.log(`[external-domain-service] deleteDomain called with id: ${id}`)
    await prisma.externalDomain.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting domain with ID ${id}:`, error)
    return false
  }
}
