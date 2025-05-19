import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center text-center p-8">
      <h1 className="text-4xl font-bold text-amber-700 mb-4">
        Bem-vindo ao Petz Adoção!
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-8">
        Aqui você encontra seu novo melhor amigo. Explore os pets disponíveis
        para adoção e transforme uma vida hoje mesmo.
      </p>
      <Link
        href="/quero-adotar"
        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded text-lg"
      >
        Ver pets disponíveis
      </Link>
    </main>
  );
}
