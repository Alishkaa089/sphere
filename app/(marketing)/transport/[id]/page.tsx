import { getVehicleById, getVehicles } from "@/lib/actions";
import TransportDetailsClient from "./TransportDetailsClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({
    id: v.id,
  }));
}

export default async function TransportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const vehicle = await getVehicleById(unwrappedParams.id);

  if (!vehicle) {
    notFound();
  }

  return <TransportDetailsClient vehicle={vehicle} />;
}
