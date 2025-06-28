import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TravelPlan from "@/pages/travel-plan";
import Budget from "@/pages/budget";
import Reviews from "@/pages/reviews";
import FAQ from "@/pages/faq";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  return (
    <Switch>
      {/* Pages without header/footer */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Pages with header/footer */}
      <Route path="*">
        <Header />
        <main className="min-h-screen">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/travel-plan" component={TravelPlan} />
            <Route path="/budget" component={Budget} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/faq" component={FAQ} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
