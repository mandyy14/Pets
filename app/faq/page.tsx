import { Navbar } from "@/components/navbar";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Perguntas Frequentes
        </h1>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Como funciona o processo de adoção?
            </h2>
            <p className="text-gray-600">
              O processo de adoção é simples e transparente. Primeiro, você
              escolhe um pet que gostaria de adotar. Em seguida, preenche um
              formulário de interesse e nossa equipe entrará em contato para
              agendar uma visita.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quais são os requisitos para adotar?
            </h2>
            <p className="text-gray-600">Para adotar, você precisa:</p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Ser maior de 18 anos</li>
              <li>
                Apresentar documento de identidade e comprovante de residência
              </li>
              <li>Passar por uma entrevista com nossa equipe</li>
              <li>
                Ter condições de oferecer um lar seguro e amoroso para o pet
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Os pets são vacinados e castrados?
            </h2>
            <p className="text-gray-600">
              Sim, todos os nossos pets são entregues vacinados, vermifugados e,
              quando em idade apropriada, castrados. A saúde e bem-estar dos
              animais é nossa prioridade.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Existe alguma taxa para adoção?
            </h2>
            <p className="text-gray-600">
              Não cobramos taxa de adoção, mas pedimos o compromisso de cuidar
              bem do animal e mantê-lo em boas condições de saúde. Eventuais
              custos com veterinário, alimentação e outros cuidados são de
              responsabilidade do adotante.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
