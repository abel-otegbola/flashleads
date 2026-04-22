import { Link } from "react-router-dom";
import { AddCircle } from "@solar-icons/react";
import Button from "../../../components/button/Button";

export default function CaseStudies() {
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-6 justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-2">Case Studies</h1>
          <p className="opacity-[0.6]">Manage and design case studies</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/account/case-studies/new">
            <Button className="flex items-center gap-2">
              <AddCircle size={20} />
              Add New Case Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Feed Layout */}
      
    </div>
  );
}
