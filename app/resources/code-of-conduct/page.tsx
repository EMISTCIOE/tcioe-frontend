import { AnimatedSection } from "@/components/animated-section";

export default function ProfessionalCodeOfConductPage() {
  return (
    <AnimatedSection className="container mx-auto px-4 lg:px-6 py-10">
      <div className="max-w-4xl mx-auto prose prose-blue">
        <h1 className="text-4xl font-bold text-primary-blue mb-4">
          Professional Code of Conduct
        </h1>
        <p className="text-text-dark">
          The Professional Code of Conduct to be followed by the registered
          Engineers of the Council, subject to the provision of the Nepal
          Engineering Council (NEC) Act, 2055 (1998) and the Nepal Engineering
          Council Regulation, 2057 (2000), has been published as follows:
        </p>

        <div className="space-y-5 mt-6">
          <section>
            <h2 className="text-2xl font-semibold">Discipline and Honesty</h2>
            <p>
              The engineering service/profession must be conducted in a
              disciplined manner with honesty, not contravening professional
              dignity and well-being.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Politeness and Confidentiality</h2>
            <p>
              Engineering services for customers should be dealt with politely
              and professional information should remain confidential except
              with written or verbal consent of the customers concerned. This
              does not restrict providing information to the concerned authority
              as per existing laws.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Non-discrimination</h2>
            <p>
              No discrimination should be made against customers on the grounds
              of religion, race, sex, caste, or any other factor while applying
              professional knowledge and skills.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Professional Work</h2>
            <p>
              Individuals should only perform professional work in their field
              or provide recommendations within the area of their study,
              knowledge, or skills. Works outside one’s domain should be
              recommended to experts of the relevant subject matter.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">
              Deeds which may cause harm to the engineering profession
            </h2>
            <p>
              Except for salary, allowance, and benefits for services provided,
              one shall not obtain improper financial gain or conduct improper
              activities of any kind which would impair the engineering
              profession.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Personal responsibility</h2>
            <p>
              All individuals will be personally responsible for all works
              performed in connection with their engineering profession.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">
              State name, designation and registration no
            </h2>
            <p>
              While signing documents or descriptions such as designs, maps,
              specifications, and estimates relating to the engineering
              profession, include the name, designation, and NEC registration
              number in a clear and comprehensible manner.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">
              Avoid publicity or advertisement causing unnecessary effect
            </h2>
            <p>
              In connection with professional activities, do not make publicity
              or advertisement in a manner that causes unnecessary effect upon
              customers.
            </p>
          </section>
        </div>

        <div className="mt-10 p-5 rounded-lg bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-semibold mb-1">Nepal Engineering Council</h3>
          <p>Bhagwati Marga 742/4, Naxal, Kathmandu - 1</p>
          <p>Post Box No. 2049, Phone No.: 977-01-4420655, 4420656</p>
          <p>Fax: 977-01-4422099</p>
          <p>
            Website: <a className="underline" href="http://www.nec.gov.np">www.nec.gov.np</a>,
            Email: <a className="underline" href="mailto:necgov@ntc.net.np">necgov@ntc.net.np</a>
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
