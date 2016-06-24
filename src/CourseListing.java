/**
 * Created by Tara on 6/8/2016.
 */
public class CourseListing {

    private String department;
    private String number;

    private String courseID;

    private String title;
    private String days;
    private String timeWords;
    private String location;
    private String professor;
    private String space;

    private String CRN;

    public void setInternationalism(boolean internationalism) {
        this.internationalism = internationalism;
    }

    public void setQs(int qs) {
        this.qs = qs;
    }

    public void setUsID(boolean usID) {
        this.usID = usID;
    }

    public void setWa(boolean wa) {
        this.wa = wa;
    }

    public void setWc(boolean wc) {
        this.wc = wc;
    }

    public void setWp(boolean wp) {
        this.wp = wp;
    }

    private boolean internationalism;
    private int qs;
    private boolean usID;
    private boolean wa, wc, wp;


    public CourseListing(String s1, String s2, String s3, String s4, String s5, String s6, String s7){
        //Department
        int startIndex = s1.indexOf("wrap;\">") + 7;
        int endIndex = s1.indexOf("&nbsp;");
        department = s1.substring(startIndex, endIndex);

        //Number
        startIndex=endIndex+6;
        endIndex=s1.indexOf("</span");
        number=s1.substring(startIndex, endIndex);

        //Course ID
        courseID=department+" "+number;

        //Title and CRN
        CRN="0";
        startIndex=s2.indexOf("<td>") + 4;
        endIndex=s2.indexOf("</td>");
        title=s2.substring(startIndex, endIndex);
        title=title.replaceAll("'", "\\\\'");
        if(title.contains("href")){
            int start=title.indexOf("CRN=")+4;
            int end=title.indexOf("\"",start);
            CRN=title.substring(start,end);
            start=title.indexOf(">")+1;
            end=title.indexOf("</a>");
            title=title.substring(start,end);
        }
        //System.out.println(CRN+","+title);

        //Days
        startIndex=s3.indexOf("<td>") + 4;
        endIndex=s3.indexOf("</td>");
        days=s3.substring(startIndex, endIndex);

        //Time words
        startIndex=s4.indexOf("nowrap;\">") + 9;
        endIndex=s4.indexOf("</span>");
        timeWords=s4.substring(startIndex, endIndex);
        timeWords=timeWords.replace("-"," - ");

        //Location
        startIndex=s5.indexOf("<td>") + 4;
        endIndex=s5.indexOf("</td>");
        location=s5.substring(startIndex, endIndex);

        //Professor
        startIndex=s6.indexOf("<td>") + 4;
        endIndex=s6.indexOf("</td>");
        professor=s6.substring(startIndex, endIndex);

        //Space
        startIndex=s7.indexOf("<td>") + 4;
        endIndex=s7.indexOf("</td>");
        space=s7.substring(startIndex, endIndex);
        space=space.replaceAll("&nbsp;","");

        //Initialize Gen Ed requirements
        internationalism=false;
        qs=0;
        usID=false;
        wa=false;
        wc=false;
        wp=false;

    }

    public String getID(){
        return courseID;
    }


    @Override
    public String toString(){
        return printJSElement();
    }

    public String printJSElement(){
        String genEd=(internationalism?"Internationalism, ":"") +((qs>0)?"Q"+qs+", ":"")
                +(usID?"U.S. Identities, ":"");
        if(wa||wc||wp){
            genEd+="Writing " + (wa?"A,":"")+ (wc?"C,":"")+ (wp?"P,":"")+" ";
        }
        if(genEd.length()>2) {
            genEd = genEd.substring(0, genEd.length() - 2);
            //System.out.println("[" + genEd + "]");
        }

        return "['<span id="+department+number+" CRN="+CRN+" >" +department +"</span>','"
                +number +"','" +title +"','" +days
                +"','" +timeWords +"','" +location +"',\"" +professor +"\",'" +space+"','" + genEd
                + "','" + qs
                +"','" +(internationalism?"INTERNAT,":"") +((qs>0)?"Q"+qs+",":"")
                +(usID?"USID,":"") + (wa?"WA,":"")  +(wc?"WC,":"")  +(wp?"WP,":"")
                + "','"+CRN
                + "']";
    }

}
