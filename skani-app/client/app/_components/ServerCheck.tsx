import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAPI } from "@/lib/api";

export default async function ServerCheck() {
  const data = await getAPI({ route: "/" });
  return (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-2xl font-bold">Server Check</h3>
      </CardHeader>
      <CardContent>
        <p>
          Message from Server:
          <br />
        </p>
        <p>
          <strong>{data.msg}</strong>
        </p>
      </CardContent>
    </Card>
  );
}
