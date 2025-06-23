import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/hooks/use-auth";

export default function IndexPage() {
  const { user } = useAuth();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <p>
          Bem vindo, <strong>{user?.nome}</strong>!
        </p>
      </section>
    </DefaultLayout>
  );
}
