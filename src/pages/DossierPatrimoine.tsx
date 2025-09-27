import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function DossierPatrimoine() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Patrimoine & Budget</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Evaluation : 23/09/2025</span>
          <Button variant="outline" size="sm">
            Mettre à jour O2S
          </Button>
          <Button variant="outline" size="sm">
            Transferts
          </Button>
          <Button variant="outline" size="sm">
            Editions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="synthese" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
          <TabsTrigger value="societes">Sociétés</TabsTrigger>
          <TabsTrigger value="actifs">Actifs</TabsTrigger>
          <TabsTrigger value="passifs">Passifs</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="projection">Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Patrimoine net */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Patrimoine net</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">8 081 €</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Actifs</span>
                    <span className="text-sm font-medium">8 081 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Passifs</span>
                    <span className="text-sm font-medium">0 €</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <div className="flex-1 h-4 bg-blue-500 rounded"></div>
                    <div className="flex-1 h-4 bg-teal-500 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                      Actifs financiers
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-teal-500 rounded mr-1"></div>
                      Patrimoine net
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actifs */}
            <Card>
              <CardHeader>
                <CardTitle>Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">8 081 €</div>
                <div className="w-full bg-teal-500 rounded h-4 mb-4"></div>
                <div className="text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded mr-2"></div>
                    Épargne retraite et salariale
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">8 081 €</div>
                </div>
              </CardContent>
            </Card>

            {/* Actifs financiers */}
            <Card>
              <CardHeader>
                <CardTitle>Actifs financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">8 081 €</div>
                <div className="w-24 h-24 mx-auto mb-4">
                  <PieChart className="w-full h-full text-teal-500" />
                </div>
                <div className="text-sm text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-teal-500 rounded mr-2"></div>
                    Épargne retraite et salariale
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">8 081 €</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenus perçus */}
            <Card>
              <CardHeader>
                <CardTitle>Revenus perçus en 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0 €</div>
              </CardContent>
            </Card>

            {/* Endettement */}
            <Card>
              <CardHeader>
                <CardTitle>Endettement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl font-bold text-muted-foreground">0 %</div>
                </div>
              </CardContent>
            </Card>

            {/* Projection patrimoniale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Projection patrimoniale et budgétaire</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="w-full bg-teal-500 rounded h-3"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="societes">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Sociétés</h2>
            <p className="text-muted-foreground">Gestion des participations et sociétés</p>
          </div>
        </TabsContent>

        <TabsContent value="actifs">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Actifs</h2>
            <p className="text-muted-foreground">Détail des actifs patrimoniaux</p>
          </div>
        </TabsContent>

        <TabsContent value="passifs">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Passifs</h2>
            <p className="text-muted-foreground">Gestion des dettes et emprunts</p>
          </div>
        </TabsContent>

        <TabsContent value="revenus">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Revenus</h2>
            <p className="text-muted-foreground">Analyse des revenus</p>
          </div>
        </TabsContent>

        <TabsContent value="charges">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Charges</h2>
            <p className="text-muted-foreground">Gestion des charges</p>
          </div>
        </TabsContent>

        <TabsContent value="projection">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projection patrimoniale et budgétaire</h2>
              <Button variant="outline" size="sm">
                Exporter vers Excel
              </Button>
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Projection sur 10 ans à partir de 2025</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                ✏️
              </Button>
            </div>

            <Tabs defaultValue="patrimoine" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patrimoine">Patrimoine</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="impot">Impôt sur le revenu</TabsTrigger>
              </TabsList>

              <TabsContent value="patrimoine" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 w-16 bg-gray-50">&nbsp;</th>
                        <th className="text-left p-3 w-24 bg-gray-50">&nbsp;</th>
                        <th className="text-left p-3 w-48 bg-gray-50">&nbsp;</th>
                        <th className="text-center p-3 bg-gray-50 border-l">23/09/2025</th>
                        <th className="text-center p-3 bg-gray-50">2025</th>
                        <th className="text-center p-3 bg-gray-50">2026</th>
                        <th className="text-center p-3 bg-gray-50">2027</th>
                        <th className="text-center p-3 bg-gray-50">2028</th>
                        <th className="text-center p-3 bg-gray-50">2029</th>
                        <th className="text-center p-3 bg-gray-50">2030</th>
                        <th className="text-center p-3 bg-gray-50">2031</th>
                        <th className="text-center p-3 bg-gray-50">2032</th>
                        <th className="text-center p-3 bg-gray-50">2033</th>
                        <th className="text-center p-3 bg-gray-50">2034</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            ⊖
                          </Button>
                        </td>
                        <td className="p-3 font-medium">1</td>
                        <td className="p-3 font-medium">Actifs</td>
                        <td className="text-center p-3 border-l">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            ⊕
                          </Button>
                        </td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3 pl-8">Épargne retraite et salariale</td>
                        <td className="text-center p-3 border-l">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                        <td className="text-center p-3">8 081 €</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50 bg-blue-50">
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3 font-medium">Actif net</td>
                        <td className="text-center p-3 border-l font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                        <td className="text-center p-3 font-medium">8 081 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Tableau des projections budgétaires</p>
                </div>
              </TabsContent>

              <TabsContent value="impot" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Tableau des projections d'impôt sur le revenu</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}