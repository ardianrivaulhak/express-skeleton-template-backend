import { initializeApp, applicationDefault } from 'firebase-admin/app';
const firebaseAdminApp = initializeApp({
    credential: applicationDefault()
});

export default  firebaseAdminApp;
