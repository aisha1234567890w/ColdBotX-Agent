import supervisorImg from '../assets/supervisor.jpg'; // <-- ADD SUPERVISOR IMAGE HERE
import bilalImg from '../assets/bilal.jpg';
import habibImg from '../assets/habib.jpg';
import ibrahimImg from '../assets/ibrahim.jpg';

export const TEAM_MEMBERS = [
    {
        id: 0,
        name: 'Dr. Naveed Khan Baloch', // <-- SUPERVISOR NAME UPDATED
        role: 'Project Supervisor',
        university: 'UET Taxila',
        bio: 'Guiding the Learnoviax team with expert insights and academic supervision.',
        image: supervisorImg,
        social: {
            // 👇 PASTE YOUR SUPERVISOR'S LINKS HERE 👇
            linkedin: 'https://linkedin.com/in/', // Example: 'https://linkedin.com/in/...'
            github: 'https://linkedin.com/in/',   // Example: 'https://github.com/...'
            email: 'naveed.baloch@learnoviax.dev'     // Example: 'naveed@example.com'
        }
    },
    {
        id: 1,
        name: 'Bilal Qadeer',
        role: 'BS Computer Engineering',
        university: 'UET Taxila',
        bio: 'Passionate about building intelligent systems and scalable web applications. Leading the technical architecture of Learnoviax.',
        image: bilalImg,
        social: {
            linkedin: 'https://www.linkedin.com/in/bilal-qadeer-91b009330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            github: 'https://github.com/bilalq126',
            email: 'bilalqadeer126@gmail.com'
        }
    },
    {
        id: 2,
        name: 'Habib Ullah',
        role: 'BS Computer Engineering',
        university: 'UET Taxila',
        bio: 'Focused on AI agent interaction and backend performance. Ensuring smooth communication between our multi-agent system.',
        image: habibImg,
        social: {
            linkedin: 'https://www.linkedin.com/in/engr-habib-ullah-565a562ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            github: 'https://github.com/dummy-habib',
            email: 'habib@example.com'
        }
    },
    {
        id: 3,
        name: 'Ibrahim Siddiqui',
        role: 'BS Computer Engineering',
        university: 'UET Taxila',
        bio: 'Expert in frontend user experience and educational pedagogy integration. crafting the intuitive interface of Learnoviax.',
        image: ibrahimImg,
        social: {
            linkedin: 'https://www.linkedin.com/in/muhammad-ibrahim-siddiqi-5b45472b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            github: 'https://github.com/dummy-ibrahim',
            email: 'ibrahimsiddiqui869@gmail.com'
        }
    }
];
