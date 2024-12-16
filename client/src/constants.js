export const Server = "http://localhost:8000/api/v1"

export function extractErrorMessage(html) {
    const regex = /<pre>(.*?)<br>/;
    const match = html?.match(regex);
    return match ? match[1] : "Something went wrong. Please try again";
  }

  export const selfQuestions = [
    {
      category: "agility",
      subcategories: [
        {
          subcategory: "change",
          SNo: 1,
          question: "Responding to Change - How effectively do you adapt to unexpected changes in your work environment?"
        },
        {
          subcategory: "solving",
          SNo: 2,
          question: "Problem-Solving in Dynamic Situations - How well do you solve problems when faced with rapidly changing or unclear circumstances?"
        },
        {
          subcategory: "flexibility",
          SNo: 3,
          question: "Flexibility/ Adaptability in Work Approach - How flexible are you in changing your work approach to suit new demands or priorities?"
        },
        {
          subcategory: "influence",
          SNo: 4,
          question: "Influencing and Inspiring Agility in Others - How effectively do you influence and inspire others to be agile?"
        }
      ]
    },
    {
      category: "reliability",
      subcategories: [
        {
          subcategory: "consistency",
          SNo: 5,
          question: "Consistency in Performance - How reliable are you in maintaining consistent performance levels?"
        },
        {
          subcategory: "accountability",
          SNo: 6,
          question: "Accountability - How accountable are you for your actions and responsibilities?"
        },
        {
          subcategory: "trust",
          SNo: 7,
          question: "Trustworthiness - How trustworthy are you in handling tasks, information, and responsibilities?"
        },
        {
          subcategory: "punctuality",
          SNo: 8,
          question: "Punctuality - How punctual are you in arriving at work, meetings, and appointments?"
        }
      ]
    },
    {
      category: "risk",
      subcategories: [
        {
          subcategory: "calculation",
          SNo: 9,
          question: "Taking Calculated Risks - How effectively do you take calculated risks to achieve strategic goals?"
        },
        {
          subcategory: "assessment",
          SNo: 10,
          question: "Risk Assessment and Analysis - How proficient are you in assessing and analysing the potential impact and likelihood of identified risks?"
        },
        {
          subcategory: "identification",
          SNo: 11,
          question: "Identifying Risks- How effectively do you identify potential risks in your area of responsibility?"
        },
        {
          subcategory: "plans",
          SNo: 12,
          question: "Implementing Risk Management Plans - How effectively do you implement risk management plans and ensure compliance?"
        }
      ]
    },
    {
      category: "decision",
      subcategories: [
        {
          subcategory: "analysis",
          SNo: 13,
          question: "Analysing Options - How effectively do you analyse different options before deciding?"
        },
        {
          subcategory: "decision",
          SNo: 14,
          question: "Confidence in Decisions - How confident are you in the decisions you make?"
        },
        {
          subcategory: "consequence",
          SNo: 15,
          question: "Considering Consequences - How well do you anticipate the potential consequences of your decisions?"
        },
        {
          subcategory: "timeline",
          SNo: 16,
          question: "Timeliness in Decision-Making - How timely are your decisions?"
        }
      ]
    },
    {
      category: "vision",
      subcategories: [
        {
          subcategory: "creation",
          SNo: 17,
          question: "Vision Creation - How effectively do you create a clear and strategic vision for the future?"
        },
        {
          subcategory: "inspiration",
          SNo: 18,
          question: "Inspiring and Motivating Others - How effectively do you inspire and motivate others to work towards the vision?"
        },
        {
          subcategory: "adaption",
          SNo: 19,
          question: "Adapting and Evolving the Vision - How effectively do you adapt and evolve the vision in response to changing circumstances and feedback?"
        },
        {
          subcategory: "spread",
          SNo: 20,
          question: "Communicating the Vision - How effectively do you communicate the vision to others, ensuring understanding and buy-in?"
        }
      ]
    },
    {
      category: "connect",
      subcategories: [
        {
          subcategory: "empathy",
          SNo: 21,
          question: "Empathy and Understanding - How well do you demonstrate empathy and understanding towards others?"
        },
        {
          subcategory: "relationship",
          SNo: 22,
          question: "Building Relationships - How effectively do you build and maintain positive relationships with colleagues, clients, and stakeholders?"
        },
        {
          subcategory: "teamwork",
          SNo: 23,
          question: "Collaboration and Teamwork - How effectively do you collaborate and work as part of a team?"
        },
        {
          subcategory: "communication",
          SNo: 24,
          question: "Communication Skills - How effectively do you communicate with others, both verbally and non-verbally?"
        }
      ]
    }
  ];
  


