from pyresparser import ResumeParser


def parse_pdf(request):
    data = ResumeParser(
        "C:/Users/Mr Eugene/Documents/MUTUYIMANA Eugene_CV").get_extracted_data()
    print(data)

    return {}
