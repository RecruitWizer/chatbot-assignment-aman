import pdfplumber

from llama_index.program import (
    OpenAIPydanticProgram,
    DFFullProgram,
    DataFrame,
    DataFrameRowsOnly,
)
from llama_index.llms import OpenAI

def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text

pdf_path = "resumes/Aman_Adatia_SDE_Resume.pdf"

resume_text = extract_text_from_pdf(pdf_path)

prompt_template_str = (
    "Please extract the following query into a structured data according"
    f" to: {resume_text}. Please extract experience (if any) with work details of each experience of the candidate."
    # f" to: {resume_text}. Please extract the name, education, experience (if any) with work details of each experience, projects (if any) with project details (work done) and skills (if any) of the candidate with all associated details."
)


program = OpenAIPydanticProgram.from_defaults(
    output_cls=DataFrame,
    llm=OpenAI(temperature=0, model="gpt-4-0613"),
    prompt_template_str=prompt_template_str,
    verbose=True,
)

response_obj = program()