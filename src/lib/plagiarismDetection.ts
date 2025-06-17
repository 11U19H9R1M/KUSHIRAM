
import { AssignmentSubmission, PlagiarismResult, PlagiarismMatch } from "./assignmentTypes";

// Simple text similarity algorithm using Jaccard similarity
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  
  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  return (intersection.size / union.size) * 100;
};

// Extract text content from PDF (simulated - in real app would use PDF.js)
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // Simulated PDF text extraction
  // In a real implementation, you would use PDF.js or similar library
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate extracted text based on filename for demo
      const sampleTexts = [
        "This is a sample academic paper about data structures and algorithms. The content discusses various sorting algorithms including quicksort, mergesort, and heapsort.",
        "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.",
        "Database management systems are crucial for storing, retrieving, and managing data efficiently. SQL is the standard language for relational databases.",
        "Software engineering principles include modularity, abstraction, encapsulation, and inheritance. These concepts help in building maintainable code."
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      resolve(`${randomText} Content extracted from ${file.name}`);
    }, 1000);
  });
};

// Check plagiarism against existing submissions
export const checkPlagiarism = async (
  currentSubmission: AssignmentSubmission,
  existingSubmissions: AssignmentSubmission[]
): Promise<PlagiarismResult> => {
  const matches: PlagiarismMatch[] = [];
  let maxSimilarity = 0;
  
  if (!currentSubmission.textContent) {
    return {
      score: 0,
      matches: [],
      checkedAt: new Date().toISOString(),
      service: "internal"
    };
  }
  
  // Compare with each existing submission
  for (const submission of existingSubmissions) {
    if (submission.id === currentSubmission.id || !submission.textContent) continue;
    
    const similarity = calculateTextSimilarity(
      currentSubmission.textContent,
      submission.textContent
    );
    
    if (similarity > 20) { // Only include matches above 20% similarity
      matches.push({
        submissionId: submission.id,
        studentEmail: submission.studentEmail,
        similarity,
        matchedText: [] // In real implementation, would include specific matched phrases
      });
    }
    
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }
  
  return {
    score: Math.round(maxSimilarity),
    matches: matches.sort((a, b) => b.similarity - a.similarity).slice(0, 5), // Top 5 matches
    checkedAt: new Date().toISOString(),
    service: "internal"
  };
};

// Get plagiarism status color based on score
export const getPlagiarismStatusColor = (score: number): string => {
  if (score >= 70) return "text-red-600";
  if (score >= 50) return "text-orange-600";
  if (score >= 30) return "text-yellow-600";
  return "text-green-600";
};

// Get plagiarism status text
export const getPlagiarismStatusText = (score: number): string => {
  if (score >= 70) return "High Risk";
  if (score >= 50) return "Medium Risk";
  if (score >= 30) return "Low Risk";
  return "Original";
};
