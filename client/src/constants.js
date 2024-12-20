export const Server = "http://localhost:8000/api/v1"

export function extractErrorMessage(html) {
    // if (!html){
    //   return "Error decoding failed"
    // }
    const regex = /<pre>(.*?)<br>/;
    const match = html?.match(regex);
    return match ? match[1] : "Something went wrong. Check your internet connection and try again";
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

  export const EmpQuestions = [
    {
      category: "agility",
      subcategories: [
        {
          subcategory: "change",
          SNo: 1,
          question: "How effectively does the individual adapt to unexpected changes in their work environment?",
          options: [
            "Needs support",
            "Needs support occasionally",
            "Needs minimal support",
            "Anticipates Change & is prepared",
            "Thrives and delivers in dynamic environment",
          ],
        },
        {
          subcategory: "solving",
          SNo: 2,
          question: "How well does the individual solve problems when faced with rapidly changing or unclear circumstances?",
          options: [
            "Needs direction",
            "Needs support occasionally",
            "Needs minimal support",
            "Creative and resourceful",
            "Excels and mentors others with innovative solutions",
          ],
        },
        {
          subcategory: "flexibility",
          SNo: 3,
          question: "How flexible is the individual in changing their work approach to suit new demands or priorities?",
          options: [
            "Risk averse and rigid",
            "Open-minded",
            "Adapts and actions",
            "Seeks and has a keen eye to change",
            "Leads by example for dynamism",
          ],
        },
        {
          subcategory: "influence",
          SNo: 4,
          question: "How effectively does the individual influence and inspire others to be agile?",
          options: [
            "A mere follower",
            "Sporadic Motivator",
            "Agility Advocate",
            "Agility Mentor",
            "Agility Champion/ Exemplar",
          ],
        },
      ],
    },
    {
      category: "reliability",
      subcategories: [
        {
          subcategory: "consistency",
          SNo: 5,
          question: "How reliable is the individual in maintaining consistent performance levels?",
          options: [
            "Under Performer",
            "Performs with guidance and motivation",
            "Performer",
            "Reliable and dedicated performer",
            "Consistent reliable performer with proven records of continuity",
          ],
        },
        {
          subcategory: "accountability",
          SNo: 6,
          question: "How accountable is the individual for their actions and responsibilities?",
          options: [
            "Lacks ownership and delivery",
            "Lacks ownership but delivers",
            "Owns it and delivers it",
            "Proactive in delivery by taking full ownership",
            "Consistently delivers with full ownership and exceptional results",
          ],
        },
        {
          subcategory: "trust",
          SNo: 7,
          question: "How trustworthy is the individual in handling tasks, information, and responsibilities?",
          options: [
            "Requires verification and follow up on deliverables",
            "Requires verification but can deliver",
            "Understands and handles job as per requirement – only random checks needed",
            "Proactive and delivers accurate data every time",
            "Consistently delivers best with most reliable work",
          ],
        },
        {
          subcategory: "punctuality",
          SNo: 8,
          question: "How punctual is the individual in arriving at work, meetings, and appointments?",
          options: [
            "Insensible to deadlines",
            "On time but with reminders",
            "Rarely late",
            "Always Punctual",
            "Punctual and sets proactive measures to ensure timelines",
          ],
        },
      ],
    },
    {
      "category": "risk",
      "subcategories": [
          {
              "subcategory": "calculation",
              "SNo": 9,
              "question": "How effectively does the individual take calculated risks to achieve strategic goals?",
              "options": [
                  "Risk Averse",
                  "Impulsive risk taker",
                  "Risks and shows result",
                  "Strategic Risk Taker",
                  "Risk Management Expert"
              ]
          },
          {
              "subcategory": "assessment",
              "SNo": 10,
              "question": "How proficient is the individual in assessing and analyzing the potential impact and likelihood of identified risks?",
              "options": [
                  "Never foresees risk",
                  "With support assesses risk",
                  "Assess risk and with support analyzes as well",
                  "Proficient in risk assessment",
                  "Expertly in risk analysis & assessment"
              ]
          },
          {
              "subcategory": "identification",
              "SNo": 11,
              "question": "How effectively does the individual identify potential risks in their area of responsibility?",
              "options": [
                  "Never identifies risk",
                  "Occasionally identifies risk",
                  "Identifies risk",
                  "Identifies most potential and not so obvious risk",
                  "Identifies consistently all risk and grooms team for risk identification"
              ]
          },
          {
              "subcategory": "plans",
              "SNo": 12,
              "question": "How effectively does the individual implement risk management plans and ensure compliance?",
              "options": [
                  "Struggles with implementation of plans",
                  "Can implement with support",
                  "Can effectively implement with minimal issues",
                  "Can implement successfully",
                  "Implements, complies and continuously improves"
              ]
          }
      ]
    },
    {
      category: "decision",
      subcategories: [
        {
          subcategory: "analysis",
          SNo: 13,
          question: "How effectively does the individual analyze different options before deciding?",
          options: [
            "Rarely analyzes - poor results",
            "Occasionally analyzes - results are challenged",
            "Sometimes analyzes but not effective",
            "Analyses and achieves results",
            "Analyses and achieves effective results consistently"
          ]
        },
        {
          subcategory: "decision",
          SNo: 14,
          question: "How confident is the individual in decision making?",
          options: [
            "Often takes second guess",
            "Makes decision but has self doubt",
            "Sometimes decides but not always",
            "Often confident on decisions",
            "Always confident and stands by it."
          ]
        },
        {
          subcategory: "consequence",
          SNo: 15,
          question: "How well does the individual anticipate the potential consequences of his/her decisions?",
          options: [
            "Never anticipates consequences",
            "Rarely considers consequences in parts",
            "Sometimes considers but not comprehensive",
            "Knows thew consequences and impacts",
            "Thorough and consistently anticipates consequence & impacts"
          ]
        },
        {
          subcategory: "timeline",
          SNo: 16,
          question: "How timely is the individual in making decisions?",
          options: [
            "Always delayed and is indecisive",
            "Delayed but decides",
            "Sometimes makes decisions but with support",
            "Decides just around the deadline",
            "Always on time resulting in no delay."
          ]
        }
      ]
    },
    {
      category: "vision",
      subcategories: [
        {
          subcategory: "creation",
          SNo: 17,
          question: "How effectively does the individual create a clear and strategic vision for the future?",
          options: [
            "Lacks strategic thinking",
            "Creates vision but lacks strategic depth",
            "Creates vision or strategy occasionally",
            "Creates compelling vision",
            "Creates compelling vision with organizational alignment and purpose"
          ]
        },
        {
          subcategory: "inspiration",
          SNo: 18,
          question: "How effectively does the individual inspire and motivate others to work towards the vision?",
          options: [
            "Struggles to motivate mostly needs motivation for self",
            "Motivates but inconsistently",
            "Generally motivates and inspires",
            "Kindles Enthusiasm and always inspires",
            "Creates highly motivated team and is inspiring consistently"
          ]
        },
        {
          subcategory: "adaption",
          SNo: 19,
          question: "How effectively does the individual adapt and evolve the vision in response to changing circumstances and feedback?",
          options: [
            "Inflexible visionary",
            "Partially adaptable",
            "Adapts and accepts as guided/ directed",
            "Adapts and responsive with changing vision/ strategy",
            "Adapts and refines the vision and proactively improves the direction as well"
          ]
        },
        {
          subcategory: "spread",
          SNo: 20,
          question: "How effectively does the individual communicate the vision to others, ensuring understanding and buy-in?",
          options: [
            "Poor communicator leading to less or no engagement",
            "Communicates but lacks clarity",
            "Communicates clearly",
            "Communicates with strong buy-in",
            "Communicates inspires and motivates team for reaching the committed goals"
          ]
        }
      ]
    },
    {
      category: "connect",
      subcategories: [
        {
          subcategory: "empathy",
          SNo: 21,
          question: "How well does the individual demonstrate empathy and understanding towards others?",
          options: [
            "Appears indifferent to others' feelings",
            "Struggles to understand but is available for others",
            "Understands and others' perspectives",
            "Empathises and supports others",
            "Empathises, connects and support people to navigate through all situations"
          ]
        },
        {
          subcategory: "relationship",
          SNo: 22,
          question: "How effectively does the individual build and maintain positive relationships with colleagues, clients, and stakeholders?",
          options: [
            "Always remains distant",
            "Tries to build relationship but lacks depth",
            "Maintains positive relationship",
            "Builds and maintains positive relationships consistently",
            "Builds positive relationship and acts as a connector in the organization"
          ]
        },
        {
          subcategory: "teamwork",
          SNo: 23,
          question: "How effectively does the individual collaborate and work as part of a team?",
          options: [
            "Often Works independently",
            "Occasionally collaborates",
            "Collaborates and contributes effectively",
            "Consistently fosters collaborative work",
            "Collaborates consistently and unifies the team and achieve collective goals."
          ]
        },
        {
          subcategory: "communication",
          SNo: 24,
          question: "How effectively does the individual communicate with others, both verbally and non-verbally?",
          options: [
            "Fails to convey messages",
            "Communicates regularly but may sometimes lacks the essence",
            "Communicates as needed",
            "Communicates with precision, depth and clarity",
            "Communicates as per audience and masterfully connects"
          ]
        }
      ]
    }
  ];
  
  
  


