import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RegionalContest } from "@/lib/regionals";

interface ContestTableProps {
  contests: RegionalContest[];
}

export function ContestTable({ contests }: ContestTableProps) {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest.id}>
              <td>{contest.name}</td>
              <td>{contest.location}</td>
              <td>{contest.date}</td>
              <td>
                <Link
                  href={contest.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium"
                >
                  <span>{contest.websiteLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 inline flex-shrink-0" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
