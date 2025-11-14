import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  GraduationCap,
  Heart,
  Globe,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function ScholarshipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
      {/* Hero Section */}
      <AnimatedSection className="relative bg-gradient-to-r from-primary-blue to-secondary-blue text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Scholarships & Schemes
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            Financial aid and admission quota opportunities at IOE
          </p>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </AnimatedSection>

      {/* Important Notice */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.1}
      >
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-sm md:text-base">
            <strong>Important:</strong> For admission under different quotas,
            all required documents must be submitted within 3 days of the
            publication of the I.O.E. Entrance Examination results at the
            location specified by I.O.E. Documents received after the deadline
            will not be entertained.
          </AlertDescription>
        </Alert>
      </AnimatedSection>

      {/* Female Quota Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.2}
      >
        <Card>
          <CardHeader className="bg-pink-50">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-pink-600" />
              <CardTitle className="text-2xl text-primary-blue">
                Female Quota
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-text-dark leading-relaxed">
              10% seats in regular and full-fee programs are reserved for female
              applicants. If 10% female applicants are not selected in the
              published admission-list, the names of 10% female applicants will
              be published in the admission-list based on the order of merit
              from among the female applicants who meet the minimum
              qualification.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Program</TableHead>
                    <TableHead className="font-bold text-center">
                      Regular
                    </TableHead>
                    <TableHead className="font-bold text-center">
                      Full Fee
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Civil</TableCell>
                    <TableCell className="text-center">3</TableCell>
                    <TableCell className="text-center">10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Electronics, Communication and Information
                    </TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Computer</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Architecture</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Industrial</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Automobile</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Teacher/Staff Quota Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.3}
      >
        <Card>
          <CardHeader className="bg-blue-50">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-primary-blue">
                Teacher/Staff Quota
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-text-dark leading-relaxed">
              For the self-development of permanent teachers of IOE who have
              completed their probationary period and staff, a total of two (2)
              seats have been reserved in the constituent campuses of Institute
              of Engineering for B.E. / B.Arch.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-dark">
                  If there is no application from any teacher/staff,
                  sons/daughters of teachers and employees (who have passed the
                  probationary period for appointment) will be admitted in the
                  order of merit.
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-dark">
                  A total of two (2) seat scholarships (regular) have been
                  arranged at the graduate level for the permanent
                  teachers/employees and children of teachers/employees working
                  under the Institute of Engineering Studies.
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-dark">
                  Applicants for this seat will be admitted in order of merit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Inclusive Indigent Reservation Quota Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.4}
      >
        <Card>
          <CardHeader className="bg-green-50">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl text-primary-blue">
                Inclusive Indigent Reservation Quota
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-text-dark leading-relaxed">
              As specified in 11(a) and 11(b) of Tribhuvan University
              Organization and Educational Administration Rules 2050, twenty
              percent of the total seats on the regular side have been reserved
              for people from the following communities.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Distribution (20% quota as 100%)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-pink-600">Female</Badge>
                  <p className="text-sm text-text-dark">
                    3% Dalit Female + 2% Muslim Female
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-purple-600">
                    Adhibasi-Janajati
                  </Badge>
                  <p className="text-sm text-text-dark">16%</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-blue-600">Madhesi</Badge>
                  <p className="text-sm text-text-dark">
                    14% (including 3% Madhesi Dalit Female)
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-orange-600">Dalit</Badge>
                  <p className="text-sm text-text-dark">9%</p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-red-600">Disabled</Badge>
                  <p className="text-sm text-text-dark">9%</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-yellow-600">
                    Backward Remote Area
                  </Badge>
                  <p className="text-sm text-text-dark">7%</p>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-teal-600">Muslim</Badge>
                  <p className="text-sm text-text-dark">7%</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-indigo-600">Tharu</Badge>
                  <p className="text-sm text-text-dark">10%</p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                  <Badge className="mb-2 bg-gray-600">Others</Badge>
                  <p className="text-sm text-text-dark">8%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Seat Allocation by Program
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Program</TableHead>
                      <TableHead className="font-bold text-center">
                        Total
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Female
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Adhibasi-Janajati
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Madhesi
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Dalit
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Disabled
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Backward Remote
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Muslim
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Tharu
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Others
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Civil</TableCell>
                      <TableCell className="text-center">7</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Electronics</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mechanical</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Architecture
                      </TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Industrial</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Automobile</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Computer</TableCell>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Important Requirements
              </h3>
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm space-y-2">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          1.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">
                            Government/Community School Education:
                          </p>
                          <p>
                            The candidate must have completed their studies in a
                            government/community school. Submit Class Eight,
                            Nine, and SLC/SEE transcripts and certification from
                            the District Education Office.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          2.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">
                            Class 11 and 12 Requirements:
                          </p>
                          <p>
                            If studied in community/government school or
                            constituent campus of TU, or received scholarship,
                            submit mark sheets and certificates. Minimum 45%
                            marks and C Grade in all subjects required (first
                            attempt only).
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          3.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">
                            Economic Poverty:
                          </p>
                          <p>
                            Submit recommendation letter from municipality/rural
                            municipality stating annual family income is less
                            than Rs. 50,000.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          4.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">
                            Category-specific Documents:
                          </p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>
                              Disabled: Certificate from National Disabled
                              Federation
                            </li>
                            <li>
                              Indigenous/Ethnic: Document from National
                              Indigenous Upliftment Institute
                            </li>
                            <li>
                              Dalit: Certificate from National Dalit Commission
                            </li>
                            <li>
                              Madhesi/Tharu/Muslim: Certificate from District
                              Administration Office
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          5.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">Priority Order:</p>
                          <p>
                            If applying in multiple categories, the last quota
                            mentioned will have priority. Open category
                            applicants will be placed at the bottom.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-primary-blue">
                          6.
                        </span>
                        <div>
                          <p className="font-semibold mb-1">Full-fee Option:</p>
                          <p>
                            Applicants opting for full-paying seat will have
                            their reservation application automatically
                            canceled.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Government Institutions Quota Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.5}
      >
        <Card>
          <CardHeader className="bg-indigo-50">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <CardTitle className="text-2xl text-primary-blue">
                Government and Government-affiliated Institutions Quota
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-text-dark leading-relaxed">
              Employees working in government offices and government-owned
              institutions should be sponsored by the relevant organization.
              Seats about 1/12th of the number of admissions have been reserved
              in the Sponsored Fee programs.
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg space-y-3">
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-dark">
                  <p className="font-semibold mb-1">
                    Type 1: Regular Government Employees
                  </p>
                  <p>
                    Applicants must submit departmental approval letter and
                    sponsoring letter for 4-year full-fee program (5 years for
                    Architecture). Sponsoring organization must be at district
                    level.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-dark">
                  <p className="font-semibold mb-1">
                    Type 2: Marginalized Communities
                  </p>
                  <p>
                    For Dalits, indigenous peoples, and economically neglected
                    communities. Must have studied in government/community
                    schools. Submit Class VIII, SLC/SEE certificates and proof
                    of government/community school status from District
                    Education Office.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-dark">
                  <p className="font-semibold mb-1">Class 11-12 Requirements</p>
                  <p>
                    Must have studied in community/private campus of TU or
                    received government scholarship. Submit mark sheets and
                    certificates.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-dark">
                  <p className="font-semibold mb-1">Admission Process</p>
                  <p>
                    Must pass IOE entrance exam. Admission based on competition
                    among sponsored applicants. If quota not filled, seats go to
                    full-fee applicants in order of merit.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-dark">
                  <p className="font-semibold mb-1">Payment</p>
                  <p>
                    Payment accepted only through check of sponsoring
                    institution.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Foreign Citizens Quota Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 py-8"
        delay={0.6}
      >
        <Card>
          <CardHeader className="bg-purple-50">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl text-primary-blue">
                Foreign Citizens Quota
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-text-dark leading-relaxed">
              Under the Institute of Engineering, 1/12th of the total seats in
              Full Fee programs at constituent campuses are reserved for foreign
              citizens.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">S.N.</TableHead>
                    <TableHead className="font-bold">
                      Type of Foreign Citizen
                    </TableHead>
                    <TableHead className="font-bold">
                      Type of Entrance Exam
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell>
                      Foreign Citizen Studying in Nepalese Campus/High Schools
                    </TableCell>
                    <TableCell>
                      Entrance Examination Held by IOE Similar to Nepali
                      Students
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell>SAARC Countries' Foreign Students</TableCell>
                    <TableCell>
                      Exam as prescribed by the Entrance Examination Board, IOE
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center">3</TableCell>
                    <TableCell>
                      Foreign Students from Countries Outside SAARC
                    </TableCell>
                    <TableCell>
                      Admission after approval from IOE Entrance Examination
                      Board
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-sm">
                Applicants who have completed the minimum qualification in the
                above-mentioned entrance examinations will be eligible for
                enrollment in the constituent campuses under the Institute of
                Engineering.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* General Notes Section */}
      <AnimatedSection
        className="container mx-auto px-4 lg:px-6 pb-12"
        delay={0.7}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-primary-blue">
          <CardHeader>
            <CardTitle className="text-2xl text-primary-blue flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <span className="text-primary-blue font-bold">•</span>
              <p className="text-sm text-text-dark">
                All documents must be submitted within 3 days of the publication
                of entrance exam results.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-blue font-bold">•</span>
              <p className="text-sm text-text-dark">
                False information will result in application cancellation
                following legal procedures.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-blue font-bold">•</span>
              <p className="text-sm text-text-dark">
                Students eligible for reservation quotas will be charged the
                full fee applicable to regular students.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-blue font-bold">•</span>
              <p className="text-sm text-text-dark">
                All necessary documents must be submitted within the deadline
                for the first enrollment program (first, second, and third
                enrollment lists).
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-blue font-bold">•</span>
              <p className="text-sm text-text-dark">
                Applicants must have passed the entrance examination conducted
                by the Higher Secondary Education Board.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
