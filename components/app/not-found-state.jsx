import DynamicMetadata from "@/components/app/dynamic-metadata";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function NotFoundState({
  title = "Not Found",
  description = "The resource you are looking for does not exist.",
  detailedDescription = "The page you are looking for does not exist or has been removed.",
  buttonText = "Back to Home",
  buttonHref = "/",
  showMetadata = true,
  icon: Icon = Lock,
}) {
  return (
    <>
      {showMetadata && (
        <DynamicMetadata title={title} description={description} />
      )}
      <div className="rounded-2xl border border-dashed bg-card p-12 shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          {detailedDescription}
        </p>
        <Button asChild className="rounded-full">
          <Link href={buttonHref} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {buttonText}
          </Link>
        </Button>
      </div>
    </>
  );
}
