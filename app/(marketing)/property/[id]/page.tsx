import { getPropertyById, getProperties } from "@/lib/actions";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({
    id: p.id,
  }));
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const property = await getPropertyById(unwrappedParams.id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailsClient property={property} />;
}
