import { collection, query, where, getDocs, documentId } from "firebase/firestore";

/**
 * PHASE 10: Dynamic Synchronization (Read side)
 * Retrieves projects the client explicitly owns OR has been granted access to via Central Admin.
 */
export async function getAuthorizedProjectsForClient(db, clientId) {
  // 1. Get projects directly owned by the client
  const ownedQuery = query(collection(db, 'projects'), where('clientId', '==', clientId));
  const ownedSnap = await getDocs(ownedQuery);
  const ownedProjects = ownedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // 2. Get explicitly granted projects (Phase 8 Implementation)
  const accessQuery = query(
    collection(db, 'clientProjectAccess'), 
    where('clientId', '==', clientId), 
    where('status', '==', 'GRANTED')
  );
  const accessSnap = await getDocs(accessQuery);
  
  const grantedProjectIds = accessSnap.docs
    .map(doc => doc.data().projectId)
    .filter(id => !ownedProjects.find(p => p.id === id)); // Avoid duplicates
    
  let grantedProjects = [];
  if (grantedProjectIds.length > 0) {
    for (let i = 0; i < grantedProjectIds.length; i += 30) {
      const chunk = grantedProjectIds.slice(i, i + 30);
      const pQuery = query(collection(db, 'projects'), where(documentId(), 'in', chunk));
      const pSnap = await getDocs(pQuery);
      grantedProjects.push(...pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  }

  return [...ownedProjects, ...grantedProjects];
}
