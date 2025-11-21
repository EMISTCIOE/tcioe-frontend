import { NextRequest } from "next/server";

import env from "@/lib/env";
import {
  getMockDepartmentPrograms,
  mockDepartmentsList,
} from "@/data/mock-departments";
import { camelCaseKeys, respondWithList } from "../utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  env.API_BASE_URL ||
  "https://cdn.tcioe.edu.np";

type ProgramType = "BACHELORS" | "MASTERS" | "DIPLOMA" | "OTHER";

interface BackendDepartment {
  uuid: string;
  name: string;
  slug?: string;
  short_name?: string;
  shortName?: string;
  thumbnail?: string | null;
}

interface BackendProgram {
  uuid: string;
  name: string;
  slug: string;
  short_name?: string;
  description?: string;
  program_type?: ProgramType;
  programType?: ProgramType;
  thumbnail?: string | null;
}

async function fetchDepartments(): Promise<BackendDepartment[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/department-mod/departments?limit=200`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch (error) {
    console.error("programs api: failed to fetch departments", error);
    return [];
  }
}

async function fetchProgramsForDepartment(
  department: BackendDepartment,
  programType?: ProgramType
) {
  const slug = department.slug || department.short_name || department.shortName;
  if (!slug) return [];

  try {
    const query = new URLSearchParams({ limit: "200" });
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/department-mod/departments/${encodeURIComponent(
        slug
      )}/programs?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    const programs: BackendProgram[] = Array.isArray(data?.results)
      ? data.results
      : [];

    return programs
      .map((program) => ({
        ...program,
        program_type: program.program_type || program.programType,
      }))
      .filter((program) => !programType || program.program_type === programType)
      .map((program) => ({
        ...program,
        department: {
          uuid: department.uuid,
          name: department.name,
          slug,
          short_name: department.short_name || department.shortName,
          thumbnail: department.thumbnail,
        },
      }));
  } catch (error) {
    console.error(
      `programs api: failed to fetch programs for ${department.slug}`,
      error
    );
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programTypeParam = (searchParams.get("programType") ||
      searchParams.get("type") ||
      "") as ProgramType;
    const programType = programTypeParam
      ? (programTypeParam.toUpperCase() as ProgramType)
      : undefined;

    // Use mock data when enabled to prevent unnecessary backend calls
    if (env.USE_MOCK_DEPARTMENT) {
      const mockPrograms = mockDepartmentsList.results.flatMap((dept) => {
        const programs = getMockDepartmentPrograms(dept.slug).results;
        return programs
          .filter(
            (program) => !programType || program.programType === programType
          )
          .map((program) => ({
            ...program,
            department: {
              uuid: dept.uuid,
              name: dept.name,
              slug: dept.slug,
              short_name: dept.shortName,
              thumbnail: dept.thumbnail,
            },
          }));
      });

      return respondWithList({
        results: camelCaseKeys(mockPrograms),
        count: mockPrograms.length,
        next: null,
        previous: null,
      });
    }

    const departments = await fetchDepartments();
    const programLists = await Promise.all(
      departments.map((dept) => fetchProgramsForDepartment(dept, programType))
    );

    const flatPrograms = programLists.flat();

    console.log("programs api aggregated", {
      departments: departments.length,
      programs: flatPrograms.length,
      sample: flatPrograms.slice(0, 2),
      filter: programType,
    });

    return respondWithList({
      results: camelCaseKeys(flatPrograms),
      count: flatPrograms.length,
      next: null,
      previous: null,
    });
  } catch (error) {
    console.error("programs api: unexpected error", error);
    return respondWithList({
      results: [],
      count: 0,
      next: null,
      previous: null,
    });
  }
}
