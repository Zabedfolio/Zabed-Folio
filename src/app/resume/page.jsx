'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: '#1f2937',
  },

  header: {
    marginBottom: 24,
    textAlign: 'center',
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  role: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },

  contact: {
    fontSize: 10,
    color: '#4b5563',
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  text: {
    fontSize: 11,
    color: '#374151',
  },

  projectCard: {
    marginBottom: 14,
  },

  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  bullet: {
    marginLeft: 10,
    marginBottom: 2,
  },

  skillsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
});

function ResumePDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>Zabed Mahmud</Text>
          <Text style={styles.role}>Junior Frontend Developer</Text>

          <Text style={styles.contact}>
            +8801979333880 | zabedfolio@gmail.com
          </Text>

          <Text style={styles.contact}>
            LinkedIn | GitHub | Portfolio
          </Text>
        </View>

        {/* Objective */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Objective</Text>

          <Text style={styles.text}>
            Passionate and detail-oriented Junior Frontend Developer
            focused on building performant, user-friendly web applications
            using modern JavaScript frameworks like React and Next.js.
          </Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>

          <View style={styles.skillsGrid}>
            <Text>• HTML5, CSS3, JavaScript (ES6+)</Text>
            <Text>• React.js, Next.js, Vue.js, Tailwind CSS</Text>
            <Text>• Node.js, Express.js, REST APIs</Text>
            <Text>• Git, GitHub</Text>
          </View>
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>

          <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>
              SportNest — Sports Facility Booking Platform
            </Text>

            <Text style={styles.bullet}>
              • Authentication with Better Auth + MongoDB
            </Text>

            <Text style={styles.bullet}>
              • Real-time slot booking system
            </Text>

            <Text style={styles.bullet}>
              • Facility management dashboard
            </Text>
          </View>

          <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>
              WanderLust — Travel Booking Platform
            </Text>

            <Text style={styles.bullet}>
              • Google OAuth & email authentication
            </Text>

            <Text style={styles.bullet}>
              • Trip booking and reservation system
            </Text>

            <Text style={styles.bullet}>
              • Admin destination management dashboard
            </Text>
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>

          <Text style={styles.text}>
            B.Sc. in Computer Science & Engineering
          </Text>

          <Text style={styles.text}>
            International Islamic University Chattogram
          </Text>

          <Text style={styles.text}>
            2023 – Present
          </Text>
        </View>

        {/* Extra */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Extra-Curricular Activities
          </Text>

          <Text style={styles.text}>
            Executive Board Member — WhiteBoard Initiatives
          </Text>

          <Text style={styles.text}>
            Leadership • Teamwork • Team Management
          </Text>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>

          <Text style={styles.text}>
            Bengali — Native
          </Text>

          <Text style={styles.text}>
            English — Professional Working Proficiency
          </Text>
        </View>

        <Text style={styles.footer}>
          Built with React PDF Renderer
        </Text>

      </Page>
    </Document>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PDFDownloadLink
        document={<ResumePDF />}
        fileName="Zabed_Mahmud_Resume.pdf"
        className="bg-black text-white px-6 py-3 rounded-full"
      >
        {({ loading }) =>
          loading ? 'Generating PDF...' : 'Download Resume PDF'
        }
      </PDFDownloadLink>
    </div>
  );
}