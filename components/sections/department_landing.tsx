import Image from "next/image";

type Event = {
  title: string;
  date: string;
  description: string;
};

type DepartmentLandingPageProps = {
  departmentName: string;
  bannerImage: string;
  departmentDescription: string;
  departmentPhoto: string;
  hodMessage: string;
  hodName: string;
  hodPhoto: string;
  events: Event[];
};

export const DepartmentLandingPage = ({
  departmentName,
  bannerImage,
  departmentDescription,
  departmentPhoto,
  hodMessage,
  hodName,
  hodPhoto,
  events,
}: DepartmentLandingPageProps) => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="w-full relative">
        <div className="h-[70vh] relative">
          <Image
            src={bannerImage}
            alt="Department Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold text-center">
              {departmentName}
            </h1>
          </div>
        </div>
        <Image
          src="/data/herovector.png"
          alt="Wave Shape"
          width={1600}
          height={200}
          className="w-full h-auto absolute bottom-0 left-0 object-cover"
        />
      </section>

      {/* About Department */}
      <section className="px-6 py-12 md:px-20 bg-white grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Image
            src={departmentPhoto}
            alt="Department Photo"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover w-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-4">
            About the Department
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {departmentDescription}
          </p>
        </div>
      </section>

      {/* HOD Message */}
      <section className="px-6 py-12 md:px-20 bg-gray-100 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-bold text-primary-blue mb-4">
            Message from HOD
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {hodMessage}
          </p>
          <p className="mt-4 text-gray-600 font-semibold">— {hodName}, HOD</p>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <Image
            src={hodPhoto}
            alt="HOD Photo"
            width={300}
            height={300}
            className="rounded-full shadow-md object-cover w-64 h-64"
          />
        </div>
      </section>

      {/* Events */}
      <section className="px-6 py-12 md:px-20 bg-white">
        <h2 className="text-2xl font-semibold text-primary-blue mb-6">
          Events
        </h2>
        <ul className="space-y-4">
          {events.map((event, index) => (
            <li
              key={index}
              className="bg-gray-50 border-l-4 border-accent-orange p-4 shadow rounded"
            >
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default DepartmentLandingPage;
