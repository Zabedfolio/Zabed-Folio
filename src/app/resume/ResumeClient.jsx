'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#111827',
    fontSize: 11,
    lineHeight: 1.6,
  },

  header: {
    textAlign: 'center',
    marginBottom: 24,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  role: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  section: {
    marginBottom: 18,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 4,
  },

  text: {
    color: '#374151',
  },

  bullet: {
    marginLeft: 10,
    marginBottom: 3,
  },
});

function ResumePDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <Text style={styles.name}>Zabed Mahmud</Text>
          <Text style={styles.role}>
            Junior Frontend Developer
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Career Objective</Text>

          <Text style={styles.text}>
            Passionate frontend developer focused on
            building modern, performant web applications.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Technical Skills</Text>

          <Text style={styles.bullet}>
            • React.js, Next.js, Tailwind CSS
          </Text>

          <Text style={styles.bullet}>
            • Node.js, Express.js, MongoDB
          </Text>

          <Text style={styles.bullet}>
            • Git, GitHub
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Projects</Text>

          <Text style={styles.bullet}>
            • SportNest — Sports booking platform
          </Text>

          <Text style={styles.bullet}>
            • WanderLust — Travel booking platform
          </Text>
        </View>

      </Page>
    </Document>
  );
}

export default function ResumeClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <PDFDownloadLink
        document={<ResumePDF />}
        fileName="Zabed_Mahmud_Resume.pdf"
        className="bg-black text-white px-6 py-3 rounded-full"
      >
        {({ loading }) =>
          loading ? 'Generating PDF...' : 'Download Resume'
        }
      </PDFDownloadLink>

    </div>
  );
}